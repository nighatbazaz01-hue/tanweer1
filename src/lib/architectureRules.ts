/**
 * ╔══════════════════════════════════════════════════════════════════════╗
 * ║         TANWEER PLATFORM — ARCHITECTURE LOCK v1.0                   ║
 * ║                                                                      ║
 * ║  This file is the canonical source of truth for architectural        ║
 * ║  constraints. All new code must comply with every contract below.    ║
 * ║  Violations are caught at runtime by src/lib/devGuard.ts             ║
 * ║  and reported at /system-health.                                     ║
 * ╚══════════════════════════════════════════════════════════════════════╝
 */

// ─── Rule IDs ─────────────────────────────────────────────────────────────────
export type RuleId =
  | "RULE-DATA-001"   // Single source of truth
  | "RULE-DATA-002"   // No raw mock arrays in components
  | "RULE-DATA-003"   // Population data via permission filters only
  | "RULE-PERM-001"   // All page data reads use filterXForRole
  | "RULE-PERM-002"   // All UI actions gated by hasPermission
  | "RULE-PERM-003"   // No ad-hoc role string comparisons in JSX
  | "RULE-EVT-001"    // All store mutations emit AppEvent
  | "RULE-EVT-002"    // Events must include id, type, timestamp, actor, payload
  | "RULE-EVT-003"    // eventLog capped at 100 entries
  | "RULE-IMPORT-001" // No direct import of mockStudents, mockTeachers, etc.
  | "RULE-IMPORT-002" // @/lib/mockData may only be imported by useDataStore.ts
  | "RULE-IMPORT-003" // Population data only via @/lib/mockData/population";

export interface ArchitectureRule {
  id: RuleId;
  title: string;
  description: string;
  severity: "error" | "warning";
  allowedIn?: string[];    // file paths that may intentionally break the rule
  forbiddenPattern?: string; // regex string to detect in source
}

// ─── Canonical Rule Definitions ───────────────────────────────────────────────
export const ARCHITECTURE_RULES: Readonly<Record<RuleId, ArchitectureRule>> = Object.freeze({
  "RULE-DATA-001": {
    id: "RULE-DATA-001",
    severity: "error",
    title: "Single Source of Truth",
    description:
      "useDataStore (Zustand) is the ONLY source for mutable application data. " +
      "Components must never maintain parallel copies of students, teachers, " +
      "announcements, meetings, tasks, notifications, or admissionLeads in local state.",
  },
  "RULE-DATA-002": {
    id: "RULE-DATA-002",
    severity: "error",
    title: "No Raw Mock Arrays in Components",
    description:
      "Page components must not import raw mock arrays (e.g. mockStudents, mockThreads) " +
      "and render them directly. All data must flow through useDataStore or the " +
      "permission-filtered population helpers.",
    forbiddenPattern: "import.*mock(Students|Teachers|FeeRecords|Attendance).*from",
  },
  "RULE-DATA-003": {
    id: "RULE-DATA-003",
    severity: "error",
    title: "Population Data Requires Permission Filter",
    description:
      "getAllStudents(), getAllTeachers(), getAllParents(), generateFeeRecords(), and " +
      "generateAttendanceRecords() must always be wrapped in the corresponding " +
      "filterXForRole() call before being passed to UI. Never render raw population arrays.",
    forbiddenPattern: "getAllStudents\\(\\)(?!.*filter)",
  },
  "RULE-PERM-001": {
    id: "RULE-PERM-001",
    severity: "error",
    title: "All Page Data Reads Use Permission Filters",
    description:
      "Every page that renders entity data (students, teachers, parents, attendance, fees, " +
      "threads, announcements, meetings, tasks, notifications) must import and apply the " +
      "corresponding filterXForRole() from @/lib/permissions.",
  },
  "RULE-PERM-002": {
    id: "RULE-PERM-002",
    severity: "error",
    title: "UI Actions Gated by hasPermission",
    description:
      "Buttons and actions that create/delete/modify data (New Announcement, Schedule Meeting, " +
      "New Task, Record Payment) must be conditionally rendered using " +
      "hasPermission(activeRole, flagName) from @/lib/permissions. " +
      "Never hardcode role strings for UI gating.",
  },
  "RULE-PERM-003": {
    id: "RULE-PERM-003",
    severity: "warning",
    title: "No Ad-hoc Role String Comparisons",
    description:
      'Inline role checks (activeRole === "admin" || activeRole === "teacher") are forbidden ' +
      "in JSX return blocks. Use hasPermission() or filterXForRole() from @/lib/permissions instead. " +
      "Role strings may only appear in the permission engine itself.",
    forbiddenPattern: 'activeRole === "[a-z]+"',
    allowedIn: ["src/lib/permissions.ts", "src/store/useRoleStore.ts"],
  },
  "RULE-EVT-001": {
    id: "RULE-EVT-001",
    severity: "error",
    title: "All Store Mutations Emit AppEvent",
    description:
      "Every action in useDataStore that modifies state must call makeEvent() and prepend " +
      "the result to eventLog. Silent state mutations are forbidden. " +
      "This ensures the system is fully auditable.",
  },
  "RULE-EVT-002": {
    id: "RULE-EVT-002",
    severity: "error",
    title: "Event Schema Completeness",
    description:
      "Every AppEvent entry in eventLog must contain: id (string), type (AppEventType), " +
      "timestamp (ISO string), actor (string), payload (object). " +
      "Events missing any of these fields are invalid.",
  },
  "RULE-EVT-003": {
    id: "RULE-EVT-003",
    severity: "warning",
    title: "EventLog Capacity Cap",
    description:
      "eventLog must be capped at 100 entries using .slice(0, 100) on every append. " +
      "Unbounded growth would cause memory leaks in long-running sessions.",
  },
  "RULE-IMPORT-001": {
    id: "RULE-IMPORT-001",
    severity: "error",
    title: "Legacy Mock Exports Forbidden in Pages",
    description:
      "mockStudents, mockTeachers, mockFeeRecords, mockAttendance from @/lib/mockData.ts " +
      "must not be imported by any page or component. These are deprecated in favour of " +
      "population.ts generators and useDataStore.",
    forbiddenPattern: "import.*mock(Students|Teachers|FeeRecords|Attendance).*@/lib/mockData",
    allowedIn: [],
  },
  "RULE-IMPORT-002": {
    id: "RULE-IMPORT-002",
    severity: "error",
    title: "@/lib/mockData Legacy File Access Restricted",
    description:
      "@/lib/mockData (root legacy file) may only be imported by src/store/useDataStore.ts " +
      "for seeding mockAdmissionLeads. All other files must use @/lib/mockData/* modular files.",
    allowedIn: ["src/store/useDataStore.ts"],
  },
  "RULE-IMPORT-003": {
    id: "RULE-IMPORT-003",
    severity: "warning",
    title: "Population Generators via @/lib/mockData/population Only",
    description:
      "getAllStudents(), getAllTeachers(), getAllParents() and generate* functions must " +
      "be imported from @/lib/mockData/population. Never re-export or duplicate them.",
  },
});

// ─── Contract Definitions ─────────────────────────────────────────────────────

/** Data Contract — defines canonical sources for each entity type */
export const DATA_CONTRACT = Object.freeze({
  students:    "filterStudentsForRole(getAllStudents(), activeRole)  via @/lib/permissions",
  teachers:    "filterTeachersForRole(getAllTeachers(), activeRole)  via @/lib/permissions",
  parents:     "filterParentsForRole(getAllParents(), activeRole)    via @/lib/permissions",
  attendance:  "filterAttendanceForRole(generateAttendanceRecords(), activeRole) via @/lib/permissions",
  fees:        "filterFeesForRole(generateFeeRecords(), activeRole)  via @/lib/permissions",
  threads:     "useDataStore().threads → filterThreadsForRole()      via @/lib/permissions",
  announcements: "useDataStore().announcements → filterAnnouncementsForRole() via @/lib/permissions",
  meetings:    "useDataStore().meetings → filterMeetingsForRole()    via @/lib/permissions",
  tasks:       "useDataStore().tasks → filterTasksForRole()          via @/lib/permissions",
  notifications: "useDataStore().notifications → filterNotificationsForRole() via @/lib/permissions",
  admissionLeads: "useDataStore().admissionLeads → filterAdmissionLeadsForRole() via @/lib/permissions",
});

/** Permission Contract — maps each page to its required filter function */
export const PERMISSION_CONTRACT = Object.freeze({
  "students/page.tsx":            "filterStudentsForRole",
  "attendance/page.tsx":          "filterAttendanceForRole",
  "fees/page.tsx":                "filterFeesForRole",
  "messages/page.tsx":            "filterThreadsForRole",
  "announcements/page.tsx":       "filterAnnouncementsForRole",
  "meetings/page.tsx":            "filterMeetingsForRole",
  "tasks/page.tsx":               "filterTasksForRole",
  "notifications/page.tsx":       "filterNotificationsForRole",
  "directory/students/page.tsx":  "filterStudentsForRole",
  "directory/teachers/page.tsx":  "filterTeachersForRole",
  "directory/parents/page.tsx":   "filterParentsForRole",
});

/** Event Contract — all action → eventType mappings */
export const EVENT_CONTRACT = Object.freeze({
  sendReply:               "replyAdded",
  createThread:            "messageCreated",
  toggleStar:              "threadStarred",
  addAnnouncement:         "announcementCreated",
  addMeeting:              "meetingCreated",
  updateRSVP:              "rsvpUpdated",
  addTask:                 "taskCreated",
  updateTaskStatus:        "taskUpdated",
  markNotificationRead:    "notificationRead",
  markAllNotificationsRead: "allNotificationsRead",
  updateLeadStatus:        "leadStatusUpdated",
} as const);

/** Required fields on every AppEvent entry */
export const EVENT_SCHEMA_REQUIRED = Object.freeze(["id", "type", "timestamp", "actor", "payload"] as const);

/** Forbidden import strings that should never appear in page/component files */
export const FORBIDDEN_IMPORT_PATTERNS = Object.freeze([
  { pattern: "@/lib/mockData\"",       rule: "RULE-IMPORT-002" as RuleId, except: ["src/store/useDataStore.ts"] },
  { pattern: "mockStudents",            rule: "RULE-IMPORT-001" as RuleId, except: ["src/lib/mockData.ts"] },
  { pattern: "mockTeachers",            rule: "RULE-IMPORT-001" as RuleId, except: ["src/lib/mockData.ts"] },
  { pattern: "mockFeeRecords",          rule: "RULE-IMPORT-001" as RuleId, except: ["src/lib/mockData.ts"] },
  { pattern: "mockAttendance",          rule: "RULE-IMPORT-001" as RuleId, except: ["src/lib/mockData.ts"] },
]);

/** All registered AppEvent types */
export const REGISTERED_EVENT_TYPES = Object.freeze([
  "messageCreated", "replyAdded", "threadStarred",
  "meetingCreated", "rsvpUpdated",
  "announcementCreated",
  "taskCreated", "taskUpdated",
  "attendanceUpdated",
  "leadStatusUpdated",
  "notificationRead", "allNotificationsRead",
] as const);

export type RegisteredEventType = typeof REGISTERED_EVENT_TYPES[number];
