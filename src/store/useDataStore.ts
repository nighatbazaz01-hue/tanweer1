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
import { initialLeaveRequests, type LeaveRequest, type LeaveStatus } from "@/lib/mockData/leaves";
import { mockAdmissionLeads } from "@/lib/mockData";
import { getAllStudents, type Student } from "@/lib/mockData/population";
import { generateTransportRecords, type TransportRecord } from "@/lib/mockData/transport";
import type { AdmissionLead } from "@/types";

// ─── Event System ─────────────────────────────────────────────────────────────

export type AppEventType =
  | "messageCreated"
  | "replyAdded"
  | "threadStarred"
  | "threadArchived"
  | "threadDeleted"
  | "meetingCreated"
  | "rsvpUpdated"
  | "announcementCreated"
  | "taskCreated"
  | "taskUpdated"
  | "attendanceSaved"
  | "leadStatusUpdated"
  | "leadAdded"
  | "studentAdded"
  | "assignmentAdded"
  | "parentMessageSent"
  | "notificationRead"
  | "allNotificationsRead"
  | "transportRecordUpdated"
  | "leaveSubmitted"
  | "leaveApproved"
  | "leaveRejected";

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
let studentCounter = 1000;
let leadCounter = 1000;
let assignmentCounter = 1000;
let leaveCounter = 1000;

// ─── Assignment Type ──────────────────────────────────────────────────────────
export interface Assignment {
  id: string;
  title: string;
  grade: string;
  dueDate: string;
  points: number;
  submitted: number;
  total: number;
  status: "active" | "completed";
  createdAt: string;
}

// ─── Store Interface ──────────────────────────────────────────────────────────
interface DataStore {
  // ── Entity State ──
  students: Student[];
  threads: Thread[];
  announcements: Announcement[];
  meetings: Meeting[];
  tasks: Task[];
  notifications: Notification[];
  admissionLeads: AdmissionLead[];
  assignments: Assignment[];
  transportRecords: TransportRecord[];

  // ── Event Log (last 100 events) ──
  eventLog: AppEvent[];

  // ── Student Actions ──
  addStudent: (
    name: string,
    grade: number,
    section: string,
    parentName: string,
    parentPhone: string,
    actor: string
  ) => void;

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
  archiveThread: (threadId: string) => void;
  deleteThread: (threadId: string) => void;

  // ── Announcement Actions ──
  addAnnouncement: (a: Omit<Announcement, "id" | "readCount" | "publishedAt">) => void;

  // ── Meeting Actions ──
  addMeeting: (m: Omit<Meeting, "id">) => void;
  updateRSVP: (meetingId: string, attendeeName: string, status: RSVPStatus) => void;

  // ── Task Actions ──
  addTask: (t: Omit<Task, "id">) => void;
  updateTaskStatus: (id: string, status: TaskStatus, progress?: number) => void;
  addTaskComment: (id: string, author: string, body: string) => void;

  // ── Leave Actions ──
  leaveRequests: LeaveRequest[];
  submitLeaveRequest: (
    teacherId: string,
    teacherName: string,
    teacherAvatar: string,
    leaveType: LeaveRequest["leaveType"],
    fromDate: string,
    toDate: string,
    reason: string
  ) => void;
  approveLeaveRequest: (id: string, reviewerName: string, remarks: string) => void;
  rejectLeaveRequest:  (id: string, reviewerName: string, remarks: string) => void;

  // ── Notification Actions ──
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (role: string) => void;
  addNotification: (n: Omit<Notification, "id">) => void;

  // ── Admissions Actions ──
  updateLeadStatus: (id: string, status: AdmissionLead["status"]) => void;
  addLead: (
    studentName: string,
    gradeApplied: string,
    parentName: string,
    parentPhone: string,
    parentEmail: string,
    actor: string
  ) => void;

  // ── Attendance Actions ──
  saveAttendance: (
    grade: string,
    presentCount: number,
    absentCount: number,
    lateCount: number,
    actor: string
  ) => void;

  // ── Assignment Actions ──
  addAssignment: (
    title: string,
    grade: string,
    dueDate: string,
    points: number,
    total: number,
    actor: string
  ) => void;

  // ── Transport Actions ──
  updateTransportRecord: (
    id: string,
    address: string,
    stopLocation: string,
    parentContact: string,
    actor: string
  ) => void;
}

// ─── Store Implementation ─────────────────────────────────────────────────────
export const useDataStore = create<DataStore>((set) => ({
  students:         getAllStudents(),
  threads:          JSON.parse(JSON.stringify(mockThreads)),
  announcements:    JSON.parse(JSON.stringify(initialAnnouncements)),
  meetings:         JSON.parse(JSON.stringify(initialMeetings)),
  tasks:            JSON.parse(JSON.stringify(initialTasks)),
  notifications:    JSON.parse(JSON.stringify(allNotifications)),
  admissionLeads:   JSON.parse(JSON.stringify(mockAdmissionLeads)),
  assignments:      [],
  transportRecords: generateTransportRecords(),
  leaveRequests:    JSON.parse(JSON.stringify(initialLeaveRequests)),
  eventLog:         [],

  // ── Student Actions ──────────────────────────────────────────────────────

  addStudent: (name, grade, section, parentName, parentPhone, actor) =>
    set((state) => {
      const id = `STU-NEW-${++studentCounter}`;
      const newStudent: Student = {
        id,
        name,
        grade,
        section,
        gpa: 0,
        attendanceRate: 0,
        performanceTier: "average",
        parentName,
        parentPhone,
        parentEmail: `${parentName.toLowerCase().replace(/\s+/g, ".")}@email.com`,
        gender: "male",
        enrolledYear: 2026,
        avatar: name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
      };
      const event = makeEvent("studentAdded", actor, { studentId: id, name, grade, section });
      return {
        students: [newStudent, ...state.students],
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

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

  archiveThread: (threadId) =>
    set((state) => {
      const thread = state.threads.find((t) => t.id === threadId);
      const event = makeEvent("threadArchived", "user", { threadId, archived: !thread?.isArchived });
      return {
        threads:  state.threads.map((t) => t.id === threadId ? { ...t, isArchived: !t.isArchived } : t),
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  deleteThread: (threadId) =>
    set((state) => {
      const event = makeEvent("threadDeleted", "user", { threadId });
      return {
        threads:  state.threads.filter((t) => t.id !== threadId),
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
                completedAt: status === "done" ? new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : t.completedAt,
              }
            : t
        ),
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  addTaskComment: (id, author, body) =>
    set((state) => {
      const timeStr = new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
      const comment = { author, body, timestamp: `Jun 14, 2026 — ${timeStr}` };
      return {
        tasks: state.tasks.map((t) =>
          t.id === id
            ? { ...t, comments: [...(t.comments ?? []), comment] }
            : t
        ),
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

  addLead: (studentName, gradeApplied, parentName, parentPhone, parentEmail, actor) =>
    set((state) => {
      const id = `LEAD-NEW-${++leadCounter}`;
      const newLead: AdmissionLead = {
        id,
        leadId: `ADM-${new Date().getFullYear()}-${leadCounter}`,
        studentName,
        gradeApplied,
        parentName,
        parentPhone,
        parentEmail,
        status: "new",
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        schoolId: "SCH-001",
      };
      const event = makeEvent("leadAdded", actor, { leadId: id, studentName, gradeApplied });
      return {
        admissionLeads: [newLead, ...state.admissionLeads],
        eventLog:       [event, ...state.eventLog].slice(0, 100),
      };
    }),

  // ── Attendance Actions ──────────────────────────────────────────────────

  saveAttendance: (grade, presentCount, absentCount, lateCount, actor) =>
    set((state) => {
      const event = makeEvent("attendanceSaved", actor, {
        grade,
        present: presentCount,
        absent:  absentCount,
        late:    lateCount,
        total:   presentCount + absentCount + lateCount,
        date:    "Jun 13, 2026",
      });
      return { eventLog: [event, ...state.eventLog].slice(0, 100) };
    }),

  // ── Assignment Actions ──────────────────────────────────────────────────

  addAssignment: (title, grade, dueDate, points, total, actor) =>
    set((state) => {
      const id = `ASN-${++assignmentCounter}`;
      const newAssignment: Assignment = {
        id,
        title,
        grade,
        dueDate,
        points,
        submitted: 0,
        total,
        status:    "active",
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
      const event = makeEvent("assignmentAdded", actor, { assignmentId: id, title, grade, dueDate });
      return {
        assignments: [newAssignment, ...state.assignments],
        eventLog:    [event, ...state.eventLog].slice(0, 100),
      };
    }),

  // ── Leave Actions ────────────────────────────────────────────────────

  submitLeaveRequest: (teacherId, teacherName, teacherAvatar, leaveType, fromDate, toDate, reason) =>
    set((state) => {
      const id = `LVR-NEW-${++leaveCounter}`;
      const submittedAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const newRequest: LeaveRequest = {
        id, teacherId, teacherName, teacherAvatar, leaveType,
        fromDate, toDate, reason, status: "pending", submittedAt,
      };
      const event = makeEvent("leaveSubmitted", teacherName, {
        leaveId: id, leaveType, fromDate, toDate,
      });
      const notif: Notification = {
        id: `N${++notifCounter}`,
        type: "alert",
        title: `Leave Request — ${teacherName}`,
        body: `${teacherName} submitted a ${leaveType.replace("_", " ")} request from ${fromDate} to ${toDate}.`,
        timestamp: "Just now",
        isRead: false,
        priority: "high",
        link: "/vp/leave",
        actor: teacherName,
        roles: ["admin", "vp1", "vp2", "vp3"],
      };
      return {
        leaveRequests: [newRequest, ...state.leaveRequests],
        notifications: [notif, ...state.notifications],
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  approveLeaveRequest: (id, reviewerName, remarks) =>
    set((state) => {
      const request = state.leaveRequests.find((r) => r.id === id);
      const reviewedAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const event = makeEvent("leaveApproved", reviewerName, { leaveId: id, teacherName: request?.teacherName });
      const notif: Notification = {
        id: `N${++notifCounter}`,
        type: "announcement",
        title: "Leave Request Approved ✓",
        body: `Your ${request?.leaveType?.replace("_", " ")} request (${request?.fromDate} – ${request?.toDate}) has been approved. ${remarks ? `Remarks: ${remarks}` : ""}`,
        timestamp: "Just now",
        isRead: false,
        priority: "normal",
        link: "/teacher/leave",
        actor: reviewerName,
        roles: ["teacher"],
      };
      return {
        leaveRequests: state.leaveRequests.map((r) =>
          r.id === id
            ? { ...r, status: "approved" as LeaveStatus, reviewedAt, reviewedBy: reviewerName, remarks }
            : r
        ),
        notifications: [notif, ...state.notifications],
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  rejectLeaveRequest: (id, reviewerName, remarks) =>
    set((state) => {
      const request = state.leaveRequests.find((r) => r.id === id);
      const reviewedAt = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const event = makeEvent("leaveRejected", reviewerName, { leaveId: id, teacherName: request?.teacherName });
      const notif: Notification = {
        id: `N${++notifCounter}`,
        type: "alert",
        title: "Leave Request Not Approved",
        body: `Your ${request?.leaveType?.replace("_", " ")} request (${request?.fromDate} – ${request?.toDate}) was not approved. ${remarks ? `Reason: ${remarks}` : ""}`,
        timestamp: "Just now",
        isRead: false,
        priority: "normal",
        link: "/teacher/leave",
        actor: reviewerName,
        roles: ["teacher"],
      };
      return {
        leaveRequests: state.leaveRequests.map((r) =>
          r.id === id
            ? { ...r, status: "rejected" as LeaveStatus, reviewedAt, reviewedBy: reviewerName, remarks }
            : r
        ),
        notifications: [notif, ...state.notifications],
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  // ── Transport Actions ──────────────────────────────────────────────────

  updateTransportRecord: (id, address, stopLocation, parentContact, actor) =>
    set((state) => {
      const record = state.transportRecords.find((r) => r.id === id);
      const event = makeEvent("transportRecordUpdated", actor, {
        recordId:       id,
        studentName:    record?.studentName ?? "",
        address,
        stopLocation,
        parentContact,
      });
      const notifId = `N-TRN-${++notifCounter}`;
      const newNotif: Notification = {
        id:        notifId,
        type:      "alert",
        title:     `Transport Update — ${record?.studentName ?? "Student"}`,
        body:      `Parent updated transport details: Pickup stop changed to "${stopLocation}".`,
        timestamp: "Just now",
        isRead:    false,
        priority:  "normal",
        link:      "/transport",
        actor,
        roles:     ["admin", "vp1", "vp2", "vp3"],
      };
      return {
        transportRecords: state.transportRecords.map((r) =>
          r.id === id ? { ...r, address, stopLocation, parentContact } : r
        ),
        notifications: [newNotif, ...state.notifications],
        eventLog:      [event, ...state.eventLog].slice(0, 100),
      };
    }),
}));
