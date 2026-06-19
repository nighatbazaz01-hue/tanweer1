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
import {
  getAllStudents, generateAttendanceRecords, generateFeeRecords,
  type Student, type PopulationAttendanceRecord, type AttendanceStatus,
  type PopulationFeeRecord, type FeeStatus,
} from "@/lib/mockData/population";
import { subjectMarks as SEED_SUBJECT_MARKS } from "@/lib/mockData/student";
import { DEMO_CHILD_ID, DEMO_CHILD_NAME, DEMO_TEACHER_NAME } from "@/lib/permissions";
import {
  generateTransportRecords, type TransportRecord,
  initialVehicles, type VehicleRecord, type VehicleStatus, type VehicleType, type FuelType,
  initialTransportRequests, type TransportRequest, type TransportRequestType, type TransportRequestStatus,
} from "@/lib/mockData/transport";
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
  | "attendanceRecordUpdated"
  | "bulkAttendanceUpdated"
  | "timetableEntryAdded"
  | "timetableEntryUpdated"
  | "timetableEntryDeleted"
  | "leadStatusUpdated"
  | "leadAdded"
  | "studentAdded"
  | "assignmentAdded"
  | "parentMessageSent"
  | "notificationRead"
  | "allNotificationsRead"
  | "transportRecordUpdated"
  | "vehicleAdded"
  | "vehicleUpdated"
  | "transportRequestSubmitted"
  | "transportRequestApproved"
  | "transportRequestRejected"
  | "vehicleAssignedToRoute"
  | "leaveSubmitted"
  | "leaveApproved"
  | "leaveRejected"
  | "gradesUpdated"
  | "feePaymentRecorded";

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
let vehicleCounter = 1000;
let transportReqCounter = 1000;

// ─── Timetable Types ──────────────────────────────────────────────────────────
export interface TimetableEntry {
  id: string;
  day: string;
  period: string;
  grade: string;
  section: string;
  subject: string;
  teacher: string;
  room: string;
}

let timetableIdCounter = 2000;

const DEFAULT_TIMETABLE_ENTRIES: TimetableEntry[] = [
  { id: "TE-001", day: "Sunday",    period: "P1", grade: "10", section: "A", subject: "Mathematics",      teacher: "Dr. Sarah Al-Hamdan",   room: "R204" },
  { id: "TE-002", day: "Sunday",    period: "P2", grade: "10", section: "A", subject: "Physics",          teacher: "Mr. Khalid Al-Mutairi", room: "R301" },
  { id: "TE-003", day: "Sunday",    period: "P3", grade: "10", section: "A", subject: "English",          teacher: "Ms. Reem Al-Harbi",     room: "R105" },
  { id: "TE-004", day: "Sunday",    period: "P5", grade: "10", section: "A", subject: "Arabic",           teacher: "Dr. Layla Al-Anazi",    room: "R108" },
  { id: "TE-005", day: "Sunday",    period: "P6", grade: "10", section: "A", subject: "Chemistry",        teacher: "Mr. Faris Al-Shammari", room: "Lab1" },
  { id: "TE-006", day: "Monday",    period: "P1", grade: "10", section: "A", subject: "Physics",          teacher: "Mr. Khalid Al-Mutairi", room: "R301" },
  { id: "TE-007", day: "Monday",    period: "P2", grade: "10", section: "A", subject: "Mathematics",      teacher: "Dr. Sarah Al-Hamdan",   room: "R204" },
  { id: "TE-008", day: "Monday",    period: "P3", grade: "10", section: "A", subject: "Chemistry",        teacher: "Mr. Faris Al-Shammari", room: "Lab1" },
  { id: "TE-009", day: "Tuesday",   period: "P1", grade: "10", section: "A", subject: "Arabic",           teacher: "Dr. Layla Al-Anazi",    room: "R108" },
  { id: "TE-010", day: "Tuesday",   period: "P2", grade: "10", section: "A", subject: "Chemistry",        teacher: "Mr. Faris Al-Shammari", room: "Lab1" },
  { id: "TE-011", day: "Wednesday", period: "P1", grade: "10", section: "A", subject: "English",          teacher: "Ms. Reem Al-Harbi",     room: "R105" },
  { id: "TE-012", day: "Wednesday", period: "P3", grade: "10", section: "A", subject: "Arabic",           teacher: "Dr. Layla Al-Anazi",    room: "R108" },
  { id: "TE-013", day: "Thursday",  period: "P1", grade: "10", section: "A", subject: "Computer Science", teacher: "Mr. Hassan Al-Shehri",  room: "Lab2" },
  { id: "TE-014", day: "Thursday",  period: "P2", grade: "10", section: "A", subject: "English",          teacher: "Ms. Reem Al-Harbi",     room: "R105" },
  { id: "TE-015", day: "Sunday",    period: "P1", grade: "1",  section: "A", subject: "Arabic",           teacher: "Mr. Faris Al-Shammari", room: "R101" },
  { id: "TE-016", day: "Sunday",    period: "P2", grade: "1",  section: "A", subject: "Mathematics",      teacher: "Ms. Reem Al-Harbi",     room: "R102" },
  { id: "TE-017", day: "Sunday",    period: "P1", grade: "5",  section: "A", subject: "English",          teacher: "Mr. Hassan Al-Shehri",  room: "R201" },
  { id: "TE-018", day: "Sunday",    period: "P2", grade: "5",  section: "A", subject: "Mathematics",      teacher: "Dr. Sarah Al-Hamdan",   room: "R202" },
  { id: "TE-019", day: "Sunday",    period: "P1", grade: "9",  section: "A", subject: "Physics",          teacher: "Mr. Khalid Al-Mutairi", room: "R305" },
  { id: "TE-020", day: "Sunday",    period: "P2", grade: "9",  section: "A", subject: "Chemistry",        teacher: "Dr. Layla Al-Anazi",    room: "Lab1" },
  { id: "TE-021", day: "Sunday",    period: "P1", grade: "12", section: "A", subject: "Mathematics",      teacher: "Dr. Sarah Al-Hamdan",   room: "R204" },
  { id: "TE-022", day: "Sunday",    period: "P2", grade: "12", section: "A", subject: "Physics",          teacher: "Mr. Khalid Al-Mutairi", room: "R301" },
];

// ─── Grade Record Type ────────────────────────────────────────────────────────
export interface GradeRecord {
  studentId:   string;
  studentName: string;
  subject:     string;
  marks:       number;
  total:       number;
  grade:       string;
  change:      number;
  teacher:     string;
  updatedAt:   string;
}

// ─── Assignment Type ──────────────────────────────────────────────────────────
export interface Assignment {
  id: string;
  title: string;
  subject: string;
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
  vehicles: VehicleRecord[];
  transportRequests: TransportRequest[];
  timetableEntries: TimetableEntry[];
  attendanceRecords: PopulationAttendanceRecord[];
  gradeRecords: GradeRecord[];
  feeRecords: PopulationFeeRecord[];

  // ── School Configuration ──
  schoolConfig: { name: string; address: string; email: string; phone: string };
  updateSchoolConfig: (config: Partial<{ name: string; address: string; email: string; phone: string }>) => void;

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
  updateAttendanceRecord: (id: string, status: AttendanceStatus, actor: string) => void;
  bulkUpdateAttendance: (ids: string[], status: AttendanceStatus, actor: string) => void;

  // ── Timetable Actions ──
  addTimetableEntry: (entry: Omit<TimetableEntry, "id">, actor: string) => void;
  updateTimetableEntry: (id: string, updates: Partial<Omit<TimetableEntry, "id">>, actor: string) => void;
  deleteTimetableEntry: (id: string, actor: string) => void;

  // ── Assignment Actions ──
  addAssignment: (
    title: string,
    subject: string,
    grade: string,
    dueDate: string,
    points: number,
    total: number,
    actor: string
  ) => void;

  // ── Security / Audit Actions ──
  logSecurityEvent: (role: string, path: string, actor: string) => void;

  // ── Transport Actions ──
  updateTransportRecord: (
    id: string,
    address: string,
    stopLocation: string,
    parentContact: string,
    actor: string
  ) => void;
  addVehicle: (vehicle: Omit<VehicleRecord, "id">, actor: string) => void;
  updateVehicle: (id: string, updates: Omit<VehicleRecord, "id">, actor: string) => void;
  assignVehicleToRoute: (routeCode: string, busNumber: string, registrationNumber: string, actor: string) => void;
  submitTransportRequest: (
    studentId: string,
    studentName: string,
    parentName: string,
    requestType: TransportRequestType,
    details: string,
    routeId: string,
    actor: string,
    proposedStop?: string,
    proposedAddress?: string
  ) => void;
  approveTransportRequest: (id: string, reviewerName: string) => void;
  rejectTransportRequest: (id: string, reviewerName: string) => void;

  // ── Grade Actions ──
  bulkSetGradeRecords: (
    subject: string,
    studentGrades: Array<{ studentId: string; studentName: string; marks: number }>,
    teacher: string,
    actor: string
  ) => void;

  // ── Fee Actions ──
  recordFeePayment: (recordId: string, amount: number, actor: string) => void;
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
  assignments: [
    { id: "ASN-001", title: "Ch. 5 Exercises: Quadratic Equations", subject: "Mathematics", grade: "Grade 10-A", dueDate: "Jun 15, 2026", points: 20, submitted: 10, total: 13, status: "active" as const, createdAt: "Jun 1, 2026" },
    { id: "ASN-002", title: "Practice Problems: Quadratic Equations", subject: "Mathematics", grade: "Grade 10-B", dueDate: "Jun 15, 2026", points: 20, submitted: 22, total: 30, status: "active" as const, createdAt: "Jun 1, 2026" },
    { id: "ASN-003", title: "Mid-Term Revision Sheet",               subject: "Mathematics", grade: "Grade 11-A", dueDate: "Jun 18, 2026", points: 20, submitted: 25, total: 28, status: "active" as const, createdAt: "Jun 1, 2026" },
    { id: "ASN-004", title: "Problem Set 4: Trigonometry",           subject: "Mathematics", grade: "Grade 10-A", dueDate: "Jun 10, 2026", points: 20, submitted: 13, total: 13, status: "completed" as const, createdAt: "May 28, 2026" },
  ],
  transportRecords: generateTransportRecords(),
  vehicles:         JSON.parse(JSON.stringify(initialVehicles)),
  transportRequests: JSON.parse(JSON.stringify(initialTransportRequests)),
  leaveRequests:    JSON.parse(JSON.stringify(initialLeaveRequests)),
  timetableEntries: JSON.parse(JSON.stringify(DEFAULT_TIMETABLE_ENTRIES)),
  attendanceRecords: generateAttendanceRecords(),
  gradeRecords: SEED_SUBJECT_MARKS.map((m) => ({
    studentId:   DEMO_CHILD_ID,
    studentName: DEMO_CHILD_NAME,
    subject:     m.subject,
    marks:       m.marks,
    total:       m.total,
    grade:       m.grade,
    change:      m.change,
    teacher:     m.teacher,
    updatedAt:   "Jun 13, 2026",
  })),
  feeRecords:       generateFeeRecords(),
  schoolConfig: {
    name:    "Tanweer Academy",
    address: "",
    email:   "admin@school.edu",
    phone:   "",
  },
  updateSchoolConfig: (config) =>
    set((state) => ({ schoolConfig: { ...state.schoolConfig, ...config } })),
  eventLog:         [],

  // ── Student Actions ──────────────────────────────────────────────────────

  addStudent: (name, grade, section, parentName, parentPhone, actor) =>
    set((state) => {
      const id = `STU-NEW-${++studentCounter}`;
      const newStudent: Student = {
        id,
        name,
        grade,
        section: section as "A" | "B" | "C" | "D",
        gpa: 0,
        attendanceRate: 0,
        performanceTier: "average",
        parentName,
        parentPhone,
        parentEmail: `${parentName.toLowerCase().replace(/\s+/g, ".")}@email.com`,
        gender: "male",
        enrolledYear: 2026,
        avatar: name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase(),
        nationalId: "",
        bloodType: "O+",
        nationality: "Saudi",
        address: "",
        phone: "",
        email: "",
        interests: [],
        emergencyContact: { name: parentName, phone: parentPhone, relation: "Parent" },
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

  updateAttendanceRecord: (id, status, actor) =>
    set((state) => {
      const record = state.attendanceRecords.find((r) => r.id === id);
      const event = makeEvent("attendanceRecordUpdated", actor, {
        recordId: id,
        studentName: record?.studentName ?? "",
        status,
        grade: record?.grade,
        section: record?.section,
      });
      return {
        attendanceRecords: state.attendanceRecords.map((r) =>
          r.id === id ? { ...r, status } : r
        ),
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  bulkUpdateAttendance: (ids, status, actor) =>
    set((state) => {
      const idSet = new Set(ids);
      const event = makeEvent("bulkAttendanceUpdated", actor, {
        count: ids.length,
        status,
      });
      return {
        attendanceRecords: state.attendanceRecords.map((r) =>
          idSet.has(r.id) ? { ...r, status } : r
        ),
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  // ── Timetable Actions ────────────────────────────────────────────────────

  addTimetableEntry: (entry, actor) =>
    set((state) => {
      const id = `TE-${++timetableIdCounter}`;
      const newEntry: TimetableEntry = { id, ...entry };
      const event = makeEvent("timetableEntryAdded", actor, {
        entryId: id,
        day: entry.day,
        period: entry.period,
        subject: entry.subject,
        grade: entry.grade,
        section: entry.section,
      });
      return {
        timetableEntries: [...state.timetableEntries, newEntry],
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  updateTimetableEntry: (id, updates, actor) =>
    set((state) => {
      const event = makeEvent("timetableEntryUpdated", actor, { entryId: id, ...updates });
      return {
        timetableEntries: state.timetableEntries.map((e) =>
          e.id === id ? { ...e, ...updates } : e
        ),
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  deleteTimetableEntry: (id, actor) =>
    set((state) => {
      const entry = state.timetableEntries.find((e) => e.id === id);
      const event = makeEvent("timetableEntryDeleted", actor, {
        entryId: id,
        subject: entry?.subject,
        day: entry?.day,
        period: entry?.period,
      });
      return {
        timetableEntries: state.timetableEntries.filter((e) => e.id !== id),
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  // ── Assignment Actions ──────────────────────────────────────────────────

  addAssignment: (title, subject, grade, dueDate, points, total, actor) =>
    set((state) => {
      const id = `ASN-${++assignmentCounter}`;
      const newAssignment: Assignment = {
        id,
        title,
        subject,
        grade,
        dueDate,
        points,
        submitted: 0,
        total,
        status:    "active",
        createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      };
      const event = makeEvent("assignmentAdded", actor, { assignmentId: id, title, subject, grade, dueDate });
      return {
        assignments: [newAssignment, ...state.assignments],
        eventLog:    [event, ...state.eventLog].slice(0, 100),
      };
    }),

  logSecurityEvent: (role, path, actor) =>
    set((state) => {
      const event = makeEvent("unauthorizedAccess", actor, { role, path, blocked: true });
      return { eventLog: [event, ...state.eventLog].slice(0, 100) };
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

  // ── Vehicle / Transport Request Actions ──────────────────────────────────

  addVehicle: (vehicle, actor) =>
    set((state) => {
      const id = `VH-NEW-${++vehicleCounter}`;
      const newVehicle: VehicleRecord = { id, ...vehicle };
      const event = makeEvent("vehicleAdded", actor, { vehicleId: id, busNumber: vehicle.busNumber, registration: vehicle.registrationNumber });
      const notif: Notification = {
        id: `N-VH-${++notifCounter}`, type: "alert",
        title: `New Vehicle Added — ${vehicle.busNumber}`,
        body: `${vehicle.registrationNumber} (${vehicle.vehicleType}) has been added to the fleet.`,
        timestamp: "Just now", isRead: false, priority: "normal", link: "/transport/vehicles",
        actor, roles: ["admin", "vp1", "vp2", "vp3"],
      };
      return { vehicles: [...state.vehicles, newVehicle], notifications: [notif, ...state.notifications], eventLog: [event, ...state.eventLog].slice(0, 100) };
    }),

  updateVehicle: (id, updates, actor) =>
    set((state) => {
      const event = makeEvent("vehicleUpdated", actor, { vehicleId: id, ...updates });
      const notif: Notification = {
        id: `N-VH-${++notifCounter}`, type: "alert",
        title: `Vehicle Updated — ${updates.busNumber}`,
        body: `${updates.registrationNumber} details have been updated. Status: ${updates.status}.`,
        timestamp: "Just now", isRead: false, priority: "normal", link: "/transport/vehicles",
        actor, roles: ["admin", "vp1", "vp2", "vp3"],
      };
      return {
        vehicles: state.vehicles.map((v) => v.id === id ? { ...v, ...updates } : v),
        notifications: [notif, ...state.notifications],
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  assignVehicleToRoute: (routeCode, busNumber, registrationNumber, actor) =>
    set((state) => {
      const event = makeEvent("vehicleAssignedToRoute", actor, { routeCode, busNumber, registrationNumber });
      const notif: Notification = {
        id: `N-VH-${++notifCounter}`, type: "alert",
        title: `Vehicle Assigned to Route ${routeCode}`,
        body: `${registrationNumber} has been assigned to ${busNumber} (${routeCode}).`,
        timestamp: "Just now", isRead: false, priority: "normal", link: "/transport/routes",
        actor, roles: ["admin", "vp1", "vp2", "vp3"],
      };
      return {
        vehicles: state.vehicles.map((v) => {
          if (v.registrationNumber === registrationNumber) {
            return { ...v, busNumber, routeCode };
          }
          if (v.routeCode === routeCode || v.busNumber === busNumber) {
            return { ...v, busNumber: "", routeCode: "" };
          }
          return v;
        }),
        notifications: [notif, ...state.notifications],
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  submitTransportRequest: (studentId, studentName, parentName, requestType, details, routeId, actor, proposedStop, proposedAddress) =>
    set((state) => {
      const id = `TR-NEW-${++transportReqCounter}`;
      const newReq: TransportRequest = {
        id, studentId, studentName, parentName, requestType, details,
        ...(proposedStop    ? { proposedStop }    : {}),
        ...(proposedAddress ? { proposedAddress } : {}),
        routeId,
        status: "pending", submittedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      };
      const event = makeEvent("transportRequestSubmitted", actor, { requestId: id, studentName, requestType });
      const notif: Notification = {
        id: `N-TR-${++notifCounter}`, type: "alert",
        title: `Transport Request — ${studentName}`,
        body: `${parentName} submitted a ${requestType.replace("_", " ")} request for ${studentName}.`,
        timestamp: "Just now", isRead: false, priority: "high", link: "/transport",
        actor, roles: ["admin", "vp1", "vp2", "vp3"],
      };
      return { transportRequests: [newReq, ...state.transportRequests], notifications: [notif, ...state.notifications], eventLog: [event, ...state.eventLog].slice(0, 100) };
    }),

  approveTransportRequest: (id, reviewerName) =>
    set((state) => {
      const req = state.transportRequests.find((r) => r.id === id);
      const reviewedAt = new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
      const event = makeEvent("transportRequestApproved", reviewerName, { requestId: id, studentName: req?.studentName ?? "" });
      const notif: Notification = {
        id: `N-TR-${++notifCounter}`, type: "alert" as const,
        title: `Transport Request Approved`,
        body: `Your ${req?.requestType?.replace("_", " ") ?? "transport"} request for ${req?.studentName ?? "your child"} has been approved.`,
        timestamp: "Just now", isRead: false, priority: "normal", link: "/transport",
        actor: reviewerName, roles: ["parent"],
      };
      let updatedTransportRecords = state.transportRecords;
      if (req) {
        if (req.requestType === "change_stop" && req.proposedStop) {
          updatedTransportRecords = state.transportRecords.map((r) =>
            r.studentId === req.studentId ? { ...r, stopLocation: req.proposedStop! } : r
          );
        } else if (req.requestType === "change_address" && req.proposedAddress) {
          updatedTransportRecords = state.transportRecords.map((r) =>
            r.studentId === req.studentId ? { ...r, address: req.proposedAddress! } : r
          );
        } else if (req.requestType === "temporary" && req.proposedStop) {
          updatedTransportRecords = state.transportRecords.map((r) =>
            r.studentId === req.studentId ? { ...r, stopLocation: `[Temp] ${req.proposedStop}` } : r
          );
        }
      }
      return {
        transportRequests: state.transportRequests.map((r) =>
          r.id === id ? { ...r, status: "approved" as const, reviewedBy: reviewerName, reviewedAt } : r
        ),
        transportRecords: updatedTransportRecords,
        notifications: [notif, ...state.notifications],
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  rejectTransportRequest: (id, reviewerName) =>
    set((state) => {
      const req = state.transportRequests.find((r) => r.id === id);
      const event = makeEvent("transportRequestRejected", reviewerName, { requestId: id, studentName: req?.studentName ?? "" });
      const notif: Notification = {
        id: `N-TR-${++notifCounter}`, type: "alert",
        title: `Transport Request Rejected`,
        body: `Your ${req?.requestType?.replace("_", " ") ?? "transport"} request for ${req?.studentName ?? "your child"} could not be approved at this time.`,
        timestamp: "Just now", isRead: false, priority: "normal", link: "/transport",
        actor: reviewerName, roles: ["parent"],
      };
      return {
        transportRequests: state.transportRequests.map((r) =>
          r.id === id ? { ...r, status: "rejected" as const, reviewedBy: reviewerName, reviewedAt: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) } : r
        ),
        notifications: [notif, ...state.notifications],
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  // ── Transport Record Actions ───────────────────────────────────────────────

  // ── Grade Actions ─────────────────────────────────────────────────────────

  bulkSetGradeRecords: (subject, studentGrades, teacher, actor) =>
    set((state) => {
      const now = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
      const updated: GradeRecord[] = studentGrades.map((sg) => {
        const prev = state.gradeRecords.find(
          (r) => r.studentId === sg.studentId && r.subject === subject
        );
        const prevMarks = prev?.marks ?? sg.marks;
        const change    = sg.marks - prevMarks;
        const score     = sg.marks;
        const grade =
          score >= 90 ? "A+" : score >= 85 ? "A" : score >= 80 ? "B+" :
          score >= 75 ? "B"  : score >= 70 ? "C+" : score >= 65 ? "C" :
          score >= 60 ? "D"  : "F";
        return {
          studentId:   sg.studentId,
          studentName: sg.studentName,
          subject,
          marks:  sg.marks,
          total:  100,
          grade,
          change,
          teacher,
          updatedAt: now,
        };
      });
      const event = makeEvent("gradesUpdated", actor, {
        subject,
        count: updated.length,
        teacher,
      });
      return {
        gradeRecords: [
          ...state.gradeRecords.filter(
            (r) => !(updated.some((u) => u.studentId === r.studentId && u.subject === r.subject))
          ),
          ...updated,
        ],
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),

  // ── Transport Record Actions ───────────────────────────────────────────────

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

  // ── Fee Actions ──────────────────────────────────────────────────────────

  recordFeePayment: (recordId, amount, actor) =>
    set((state) => {
      const event = makeEvent("feePaymentRecorded", actor, { recordId, amount });
      return {
        feeRecords: state.feeRecords.map((r) => {
          if (r.id !== recordId) return r;
          const newPaid = Math.min(r.amount, r.paidAmount + amount);
          const newStatus: FeeStatus =
            newPaid >= r.amount ? "paid" : newPaid > 0 ? "partial" : r.status;
          return { ...r, paidAmount: newPaid, status: newStatus };
        }),
        eventLog: [event, ...state.eventLog].slice(0, 100),
      };
    }),
}));
