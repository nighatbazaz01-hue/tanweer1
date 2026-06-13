/**
 * Unified Data Store — Tanweer Platform
 *
 * Single source of truth for all mutable application data.
 * All reads and writes MUST go through this store.
 * Every action emits a structured event to the eventLog.
 */

import { create } from "zustand";
import { mockThreads, type Thread, type Message } from "@/lib/mockData/messages";
import { announcements as initialAnnouncements, type Announcement } from "@/lib/mockData/announcements";
import { meetings as initialMeetings, type Meeting, type RSVPStatus } from "@/lib/mockData/meetings";
import { tasks as initialTasks, type Task, type TaskStatus } from "@/lib/mockData/tasks";
import { allNotifications, type Notification } from "@/lib/mockData/notifications";
import { mockAdmissionLeads } from "@/lib/mockData";
import type { AdmissionLead } from "@/types";

// ─── Event System ─────────────────────────────────────────────────────────────

export type AppEventType =
  | "messageCreated"
  | "replyAdded"
  | "threadStarred"
  | "meetingCreated"
  | "rsvpUpdated"
  | "announcementCreated"
  | "taskCreated"
  | "taskUpdated"
  | "attendanceUpdated"
  | "leadStatusUpdated"
  | "notificationRead"
  | "allNotificationsRead";

export interface AppEvent {
  id: string;
  type: AppEventType;
  timestamp: string;
  actor: string;
  payload: Record<string, unknown>;
}

let eventCounter = 0;

function makeEvent(
  type: AppEventType,
  actor: string,
  payload: Record<string, unknown>
): AppEvent {
  return {
    id: `EVT-${++eventCounter}`,
    type,
    timestamp: new Date().toISOString(),
    actor,
    payload,
  };
}

// ─── ID Counters ──────────────────────────────────────────────────────────────
let msgCounter = 1000;
let threadCounter = 1000;
let annCounter = 1000;
let meetingCounter = 1000;
let taskCounter = 1000;
let notifCounter = 1000;

// ─── Store Interface ──────────────────────────────────────────────────────────
interface DataStore {
  // ── Entity State ──
  threads: Thread[];
  announcements: Announcement[];
  meetings: Meeting[];
  tasks: Task[];
  notifications: Notification[];
  admissionLeads: AdmissionLead[];

  // ── Event Log (last 100 events) ──
  eventLog: AppEvent[];

  // ── Message Actions ──
  sendReply: (
    threadId: string,
    body: string,
    from: { name: string; role: string; avatar: string }
  ) => void;
  createThread: (
    subject: string,
    toName: string,
    body: string,
    priority: "urgent" | "high" | "normal" | "low",
    from: { name: string; role: string; avatar: string }
  ) => void;
  toggleStar: (threadId: string) => void;

  // ── Announcement Actions ──
  addAnnouncement: (a: Omit<Announcement, "id" | "readCount" | "publishedAt">) => void;

  // ── Meeting Actions ──
  addMeeting: (m: Omit<Meeting, "id">) => void;
  updateRSVP: (meetingId: string, attendeeName: string, status: RSVPStatus) => void;

  // ── Task Actions ──
  addTask: (t: Omit<Task, "id">) => void;
  updateTaskStatus: (id: string, status: TaskStatus, progress?: number) => void;

  // ── Notification Actions ──
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (role: string) => void;
  addNotification: (n: Omit<Notification, "id">) => void;

  // ── Admissions Actions ──
  updateLeadStatus: (id: string, status: AdmissionLead["status"]) => void;
}

// ─── Store Implementation ─────────────────────────────────────────────────────
export const useDataStore = create<DataStore>((set) => ({
  threads:        JSON.parse(JSON.stringify(mockThreads)),
  announcements:  JSON.parse(JSON.stringify(initialAnnouncements)),
  meetings:       JSON.parse(JSON.stringify(initialMeetings)),
  tasks:          JSON.parse(JSON.stringify(initialTasks)),
  notifications:  JSON.parse(JSON.stringify(allNotifications)),
  admissionLeads: JSON.parse(JSON.stringify(mockAdmissionLeads)),
  eventLog:       [],

  // ── Message Actions ──────────────────────────────────────────────────────

  sendReply: (threadId, body, from) =>
    set((state) => {
      const timeStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      const newMsg: Message = {
        id:            `M${++msgCounter}`,
        threadId,
        from,
        to:            [],
        subject:       "",
        body,
        timestamp:     `Jun 13, 2026 — ${timeStr}`,
        priority:      "normal",
        status:        "read",
        hasAttachment: false,
      };
      const event = makeEvent("replyAdded", from.name, { threadId, preview: body.slice(0, 60) });
      return {
        threads: state.threads.map((t) =>
          t.id === threadId
            ? { ...t, lastMessage: body.slice(0, 80), lastTimestamp: timeStr, unreadCount: 0, messages: [...t.messages, newMsg] }
            : t
        ),
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  createThread: (subject, toName, body, priority, from) =>
    set((state) => {
      const timeStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      const threadId = `T${++threadCounter}`;
      const recipient = {
        name:   toName,
        role:   "Recipient",
        avatar: toName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
      };
      const newMsg: Message = {
        id:            `M${++msgCounter}`,
        threadId,
        from,
        to:            [recipient],
        subject,
        body,
        timestamp:     `Jun 13, 2026 — ${timeStr}`,
        priority,
        status:        "read",
        hasAttachment: false,
      };
      const newThread: Thread = {
        id:            threadId,
        participants:  [from, recipient],
        subject,
        lastMessage:   body.slice(0, 80),
        lastTimestamp: timeStr,
        priority,
        unreadCount:   0,
        messages:      [newMsg],
        isStarred:     false,
      };
      const event = makeEvent("messageCreated", from.name, { subject, to: toName, priority });
      return {
        threads:  [newThread, ...state.threads],
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  toggleStar: (threadId) =>
    set((state) => {
      const thread = state.threads.find((t) => t.id === threadId);
      const event = makeEvent("threadStarred", "user", { threadId, starred: !thread?.isStarred });
      return {
        threads:  state.threads.map((t) => t.id === threadId ? { ...t, isStarred: !t.isStarred } : t),
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  // ── Announcement Actions ────────────────────────────────────────────────

  addAnnouncement: (a) =>
    set((state) => {
      const newAnn: Announcement = {
        ...a,
        id:          `ANN${++annCounter}`,
        readCount:   0,
        publishedAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
      const event = makeEvent("announcementCreated", a.author.name, {
        title:    a.title,
        category: a.category,
        audience: a.audience,
      });
      return {
        announcements: [newAnn, ...state.announcements],
        eventLog:      [event, ...state.eventLog].slice(0, 100),
      };
    }),

  // ── Meeting Actions ─────────────────────────────────────────────────────

  addMeeting: (m) =>
    set((state) => {
      const newMeeting: Meeting = { ...m, id: `MTG${++meetingCounter}` };
      const event = makeEvent("meetingCreated", m.organizer.name, {
        title: m.title,
        date:  m.date,
        type:  m.type,
        room:  m.room,
      });
      return {
        meetings: [newMeeting, ...state.meetings],
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  updateRSVP: (meetingId, attendeeName, status) =>
    set((state) => {
      const event = makeEvent("rsvpUpdated", attendeeName, { meetingId, status });
      return {
        meetings: state.meetings.map((m) =>
          m.id === meetingId
            ? { ...m, attendees: m.attendees.map((a) => a.name === attendeeName ? { ...a, rsvp: status } : a) }
            : m
        ),
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  // ── Task Actions ────────────────────────────────────────────────────────

  addTask: (t) =>
    set((state) => {
      const newTask: Task = { ...t, id: `TSK${++taskCounter}` };
      const event = makeEvent("taskCreated", t.assignedBy.name, {
        title:    t.title,
        priority: t.priority,
        assignee: t.assignedTo.name,
        dueDate:  t.dueDate,
      });
      return {
        tasks:    [newTask, ...state.tasks],
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  updateTaskStatus: (id, status, progress) =>
    set((state) => {
      const task = state.tasks.find((t) => t.id === id);
      const event = makeEvent("taskUpdated", task?.assignedTo.name || "system", {
        taskId:   id,
        title:    task?.title,
        status,
        progress: progress ?? (status === "done" ? 100 : task?.progress),
      });
      return {
        tasks: state.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                status,
                progress:    progress !== undefined ? progress : status === "done" ? 100 : t.progress,
                completedAt: status === "done" ? "Jun 13, 2026" : t.completedAt,
              }
            : t
        ),
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  // ── Notification Actions ────────────────────────────────────────────────

  markNotificationRead: (id) =>
    set((state) => {
      const event = makeEvent("notificationRead", "user", { notificationId: id });
      return {
        notifications: state.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
        eventLog:      [event, ...state.eventLog].slice(0, 100),
      };
    }),

  markAllNotificationsRead: (role) =>
    set((state) => {
      const event = makeEvent("allNotificationsRead", role, { role });
      return {
        notifications: state.notifications.map((n) => n.roles.includes(role) ? { ...n, isRead: true } : n),
        eventLog:      [event, ...state.eventLog].slice(0, 100),
      };
    }),

  addNotification: (n) =>
    set((state) => ({
      notifications: [{ ...n, id: `N${++notifCounter}` }, ...state.notifications],
    })),

  // ── Admissions Actions ──────────────────────────────────────────────────

  updateLeadStatus: (id, status) =>
    set((state) => {
      const event = makeEvent("leadStatusUpdated", "admin", { leadId: id, status });
      return {
        admissionLeads: state.admissionLeads.map((l) => l.id === id ? { ...l, status } : l),
        eventLog:       [event, ...state.eventLog].slice(0, 100),
      };
    }),
}));
