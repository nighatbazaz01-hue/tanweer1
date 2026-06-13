import { create } from "zustand";
import { mockThreads, type Thread, type Message } from "@/lib/mockData/messages";
import { announcements as initialAnnouncements, type Announcement } from "@/lib/mockData/announcements";
import { meetings as initialMeetings, type Meeting, type RSVPStatus } from "@/lib/mockData/meetings";
import { tasks as initialTasks, type Task, type TaskStatus } from "@/lib/mockData/tasks";
import { allNotifications, type Notification } from "@/lib/mockData/notifications";

interface DataStore {
  threads: Thread[];
  announcements: Announcement[];
  meetings: Meeting[];
  tasks: Task[];
  notifications: Notification[];

  // Message actions
  sendReply: (threadId: string, body: string, from: { name: string; role: string; avatar: string }) => void;
  createThread: (subject: string, toName: string, body: string, priority: "urgent" | "high" | "normal" | "low", from: { name: string; role: string; avatar: string }) => void;
  toggleStar: (threadId: string) => void;

  // Announcement actions
  addAnnouncement: (a: Omit<Announcement, "id" | "readCount" | "publishedAt">) => void;

  // Meeting actions
  addMeeting: (m: Omit<Meeting, "id">) => void;
  updateRSVP: (meetingId: string, attendeeName: string, status: RSVPStatus) => void;

  // Task actions
  addTask: (t: Omit<Task, "id">) => void;
  updateTaskStatus: (id: string, status: TaskStatus, progress?: number) => void;

  // Notification actions
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: (role: string) => void;
  addNotification: (n: Omit<Notification, "id">) => void;
}

let msgCounter = 1000;
let threadCounter = 1000;
let annCounter = 1000;
let meetingCounter = 1000;
let taskCounter = 1000;
let notifCounter = 1000;

export const useDataStore = create<DataStore>((set) => ({
  threads: JSON.parse(JSON.stringify(mockThreads)),
  announcements: JSON.parse(JSON.stringify(initialAnnouncements)),
  meetings: JSON.parse(JSON.stringify(initialMeetings)),
  tasks: JSON.parse(JSON.stringify(initialTasks)),
  notifications: JSON.parse(JSON.stringify(allNotifications)),

  sendReply: (threadId, body, from) => set((state) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const newMsg: Message = {
      id: `M${++msgCounter}`,
      threadId,
      from,
      to: [],
      subject: "",
      body,
      timestamp: `Jun 13, 2026 — ${timeStr}`,
      priority: "normal",
      status: "read",
      hasAttachment: false,
    };
    return {
      threads: state.threads.map((t) =>
        t.id === threadId
          ? { ...t, lastMessage: body.slice(0, 80), lastTimestamp: timeStr, unreadCount: 0, messages: [...t.messages, newMsg] }
          : t
      ),
    };
  }),

  createThread: (subject, toName, body, priority, from) => set((state) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const threadId = `T${++threadCounter}`;
    const newMsg: Message = {
      id: `M${++msgCounter}`,
      threadId,
      from,
      to: [{ name: toName, role: "Recipient", avatar: toName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() }],
      subject,
      body,
      timestamp: `Jun 13, 2026 — ${timeStr}`,
      priority,
      status: "read",
      hasAttachment: false,
    };
    const newThread: Thread = {
      id: threadId,
      participants: [
        from,
        { name: toName, role: "Recipient", avatar: toName.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase() },
      ],
      subject,
      lastMessage: body.slice(0, 80),
      lastTimestamp: timeStr,
      priority,
      unreadCount: 0,
      messages: [newMsg],
      isStarred: false,
    };
    return { threads: [newThread, ...state.threads] };
  }),

  toggleStar: (threadId) => set((state) => ({
    threads: state.threads.map((t) => t.id === threadId ? { ...t, isStarred: !t.isStarred } : t),
  })),

  addAnnouncement: (a) => set((state) => {
    const now = new Date();
    const newAnn: Announcement = {
      ...a,
      id: `ANN${++annCounter}`,
      readCount: 0,
      publishedAt: now.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    return { announcements: [newAnn, ...state.announcements] };
  }),

  addMeeting: (m) => set((state) => {
    const newMeeting: Meeting = { ...m, id: `MTG${++meetingCounter}` };
    return { meetings: [newMeeting, ...state.meetings] };
  }),

  updateRSVP: (meetingId, attendeeName, status) => set((state) => ({
    meetings: state.meetings.map((m) =>
      m.id === meetingId
        ? {
            ...m,
            attendees: m.attendees.map((a) =>
              a.name === attendeeName ? { ...a, rsvp: status } : a
            ),
          }
        : m
    ),
  })),

  addTask: (t) => set((state) => {
    const newTask: Task = { ...t, id: `TSK${++taskCounter}` };
    return { tasks: [newTask, ...state.tasks] };
  }),

  updateTaskStatus: (id, status, progress) => set((state) => ({
    tasks: state.tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            status,
            progress: progress !== undefined ? progress : status === "done" ? 100 : t.progress,
            completedAt: status === "done" ? "Jun 13, 2026" : t.completedAt,
          }
        : t
    ),
  })),

  markNotificationRead: (id) => set((state) => ({
    notifications: state.notifications.map((n) => n.id === id ? { ...n, isRead: true } : n),
  })),

  markAllNotificationsRead: (role) => set((state) => ({
    notifications: state.notifications.map((n) =>
      n.roles.includes(role) ? { ...n, isRead: true } : n
    ),
  })),

  addNotification: (n) => set((state) => ({
    notifications: [{ ...n, id: `N${++notifCounter}` }, ...state.notifications],
  })),
}));
