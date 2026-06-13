export type AuditAction =
  | "LOGIN" | "LOGOUT" | "LOGIN_FAILED"
  | "STUDENT_PROFILE_VIEWED" | "TEACHER_PROFILE_VIEWED" | "PARENT_PROFILE_VIEWED"
  | "STUDENT_CREATED" | "STUDENT_EDITED"
  | "ATTENDANCE_MARKED" | "ATTENDANCE_EDITED"
  | "HOMEWORK_ASSIGNED" | "HOMEWORK_EDITED"
  | "MARKS_ENTERED" | "MARKS_EDITED"
  | "FEE_VIEWED" | "FEE_MODIFIED" | "FEE_PAYMENT_RECORDED"
  | "MESSAGE_SENT" | "ANNOUNCEMENT_CREATED" | "MEETING_CREATED"
  | "REPORT_GENERATED" | "DATA_EXPORTED"
  | "SENSITIVE_ADDRESS_VIEWED" | "SENSITIVE_PHONE_VIEWED" | "SENSITIVE_FEE_RECORD_VIEWED"
  | "SETTINGS_CHANGED" | "ROLE_CHANGED" | "PASSWORD_RESET"
  | "PIN_UNLOCK" | "SESSION_EXPIRED";

export type AuditSeverity = "critical" | "high" | "medium" | "low" | "info";
export type AuditModule =
  | "Authentication" | "Students" | "Attendance" | "Academics"
  | "Finance" | "Messaging" | "Announcements" | "Meetings"
  | "Reports" | "Settings" | "Security" | "Data Export";

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  date: string;
  time: string;
  userName: string;
  userRole: string;
  userAvatar: string;
  action: AuditAction;
  module: AuditModule;
  recordType?: string;
  recordId?: string;
  recordLabel?: string;
  fieldsViewed?: string[];
  fieldsModified?: string[];
  beforeValue?: Record<string, string>;
  afterValue?: Record<string, string>;
  deviceType: "Desktop" | "Mobile" | "Tablet";
  browser?: string;
  ipAddress: string;
  sessionId: string;
  severity: AuditSeverity;
  details: string;
  outcome: "success" | "failed" | "warning";
}

// ── Lookup Tables ──────────────────────────────────────────────────────────────

const users = [
  { name: "Dr. Khalid Al-Mansouri", role: "Principal", avatar: "DK" },
  { name: "Ms. Reem Al-Harbi", role: "Vice Principal", avatar: "RA" },
  { name: "Dr. Sarah Al-Hamdan", role: "Teacher", avatar: "SA" },
  { name: "Mr. Khalid Al-Mutairi", role: "Teacher", avatar: "KM" },
  { name: "Dr. Layla Al-Anazi", role: "Teacher", avatar: "LA" },
  { name: "Mr. Hassan Al-Shehri", role: "Teacher", avatar: "HA" },
  { name: "Mr. Faris Al-Shammari", role: "Teacher", avatar: "FS" },
  { name: "Mohammed Al-Rashidi", role: "Parent", avatar: "MR" },
  { name: "Nora Al-Ghamdi", role: "Parent", avatar: "NG" },
  { name: "Saad Al-Qahtani", role: "Parent", avatar: "SQ" },
  { name: "Admin Office", role: "Admin", avatar: "AO" },
  { name: "Finance Officer", role: "Finance", avatar: "FO" },
  { name: "IT Admin", role: "IT", avatar: "IA" },
];

const studentRecords = [
  { id: "STU-2024-001", label: "Ahmed Al-Rashidi — Grade 10-A" },
  { id: "STU-2024-002", label: "Fatima Al-Zahrani — Grade 10-A" },
  { id: "STU-2024-003", label: "Omar Al-Ghamdi — Grade 11-B" },
  { id: "STU-2024-004", label: "Nora Al-Otaibi — Grade 10-B" },
  { id: "STU-2024-005", label: "Ali Al-Mansouri — Grade 12-A" },
  { id: "STU-2024-006", label: "Sara Al-Qahtani — Grade 9-A" },
  { id: "STU-2024-007", label: "Rayan Al-Khalidi — Grade 8-C" },
  { id: "STU-2024-008", label: "Lina Al-Dosari — Grade 7-A" },
  { id: "STU-2024-009", label: "Hassan Al-Barrak — Grade 11-B" },
  { id: "STU-2024-010", label: "Yusuf Al-Dosari — Grade 10-A" },
];

const devices: ("Desktop" | "Mobile" | "Tablet")[] = ["Desktop", "Desktop", "Desktop", "Mobile", "Tablet"];
const browsers = ["Chrome 124", "Safari 17", "Edge 123", "Firefox 125", "Chrome 124"];
const ipPool = [
  "192.168.1.45", "192.168.1.87", "192.168.2.12", "10.0.0.34",
  "10.0.0.91", "172.16.0.55", "192.168.1.120", "10.0.1.7",
];

// ── Deterministic pseudo-random helper ────────────────────────────────────────
function hashNum(seed: number, max: number) {
  const x = Math.sin(seed + 1) * 10000;
  return Math.abs(Math.floor((x - Math.floor(x)) * max));
}

function sessionId(seed: number) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return "sess_" + Array.from({ length: 12 }, (_, i) => chars[hashNum(seed * 17 + i, chars.length)]).join("");
}

function makeTimestamp(dayOffset: number, seed: number) {
  const base = new Date("2024-06-13T00:00:00");
  base.setDate(base.getDate() - dayOffset);
  const hour = hashNum(seed * 3, 10) + 7;
  const min = hashNum(seed * 7, 60);
  base.setHours(hour, min, 0, 0);
  const date = base.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" });
  const time = base.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
  return { timestamp: base.toISOString(), date, time };
}

// ── Action Templates ───────────────────────────────────────────────────────────
type ActionTemplate = {
  action: AuditAction;
  module: AuditModule;
  severity: AuditSeverity;
  weight: number;
  outcome?: "success" | "failed" | "warning";
  makeDetails: (u: typeof users[0], r?: typeof studentRecords[0]) => {
    details: string;
    recordType?: string;
    recordLabel?: string;
    fieldsViewed?: string[];
    fieldsModified?: string[];
    beforeValue?: Record<string, string>;
    afterValue?: Record<string, string>;
  };
};

const actionTemplates: ActionTemplate[] = [
  {
    action: "LOGIN", module: "Authentication", severity: "info", weight: 25,
    makeDetails: (u) => ({ details: `${u.name} logged in successfully` }),
  },
  {
    action: "LOGOUT", module: "Authentication", severity: "info", weight: 18,
    makeDetails: (u) => ({ details: `${u.name} session ended — logged out` }),
  },
  {
    action: "LOGIN_FAILED", module: "Authentication", severity: "high", weight: 4, outcome: "failed",
    makeDetails: (u) => ({ details: `Failed login attempt for ${u.name} — incorrect credentials. Account flagged for review.` }),
  },
  {
    action: "STUDENT_PROFILE_VIEWED", module: "Students", severity: "low", weight: 30,
    makeDetails: (u, r) => ({
      details: `${u.name} viewed student profile`,
      recordType: "Student Profile", recordLabel: r?.label,
      fieldsViewed: ["Full Name", "Date of Birth", "Grade", "GPA", "Attendance Rate", "Class Rank"],
    }),
  },
  {
    action: "SENSITIVE_ADDRESS_VIEWED", module: "Students", severity: "medium", weight: 8,
    makeDetails: (u, r) => ({
      details: `${u.name} accessed home address for student`,
      recordType: "Student Profile", recordLabel: r?.label,
      fieldsViewed: ["Home Address", "Emergency Contact Address"],
    }),
  },
  {
    action: "SENSITIVE_PHONE_VIEWED", module: "Students", severity: "medium", weight: 10,
    makeDetails: (u, r) => ({
      details: `${u.name} accessed parent contact details`,
      recordType: "Student Profile", recordLabel: r?.label,
      fieldsViewed: ["Parent Primary Phone", "Parent Secondary Phone", "Parent Email"],
    }),
  },
  {
    action: "ATTENDANCE_MARKED", module: "Attendance", severity: "info", weight: 20,
    makeDetails: (u, r) => ({
      details: `${u.name} marked attendance for Grade 10-A`,
      recordType: "Attendance Record", recordLabel: r?.label,
      fieldsModified: ["Attendance Status"],
      beforeValue: { status: "Not Marked" }, afterValue: { status: "Present" },
    }),
  },
  {
    action: "ATTENDANCE_EDITED", module: "Attendance", severity: "medium", weight: 5,
    makeDetails: (u, r) => ({
      details: `${u.name} modified attendance record — status changed`,
      recordType: "Attendance Record", recordLabel: r?.label,
      fieldsModified: ["Attendance Status", "Reason"],
      beforeValue: { status: "Absent", reason: "—" }, afterValue: { status: "Present", reason: "Late arrival confirmed" },
    }),
  },
  {
    action: "MARKS_ENTERED", module: "Academics", severity: "info", weight: 15,
    makeDetails: (u, r) => ({
      details: `${u.name} entered exam marks for student`,
      recordType: "Exam Result", recordLabel: r?.label,
      fieldsModified: ["Mathematics Score"],
      beforeValue: { score: "Not entered" }, afterValue: { score: "82/100" },
    }),
  },
  {
    action: "MARKS_EDITED", module: "Academics", severity: "high", weight: 3,
    makeDetails: (u, r) => ({
      details: `${u.name} modified already-submitted marks — grade change after deadline`,
      recordType: "Exam Result", recordLabel: r?.label,
      fieldsModified: ["Physics Score", "Grade"],
      beforeValue: { score: "68/100", grade: "C+" }, afterValue: { score: "79/100", grade: "B+" },
    }),
  },
  {
    action: "HOMEWORK_ASSIGNED", module: "Academics", severity: "info", weight: 12,
    makeDetails: (u) => ({
      details: `${u.name} assigned homework to Grade 10-A`,
      recordType: "Homework Assignment",
      recordLabel: "Ch.5 Practice Problems — Quadratic Equations",
      fieldsModified: ["Title", "Due Date", "Points", "Assigned To"],
      afterValue: { title: "Ch.5 Practice", due: "Jun 17", points: "20", grade: "10-A" },
    }),
  },
  {
    action: "FEE_VIEWED", module: "Finance", severity: "medium", weight: 12,
    makeDetails: (u, r) => ({
      details: `${u.name} accessed fee records for student`,
      recordType: "Fee Record", recordLabel: r?.label,
      fieldsViewed: ["Total Fee", "Amount Paid", "Balance Due", "Payment History", "Payment Plan"],
    }),
  },
  {
    action: "SENSITIVE_FEE_RECORD_VIEWED", module: "Finance", severity: "high", weight: 4,
    makeDetails: (u, r) => ({
      details: `${u.name} accessed detailed financial statement including bank details`,
      recordType: "Financial Statement", recordLabel: r?.label,
      fieldsViewed: ["Bank Account Number", "Payment Reference", "Discount Applied", "Scholarship Details"],
    }),
  },
  {
    action: "FEE_MODIFIED", module: "Finance", severity: "critical", weight: 2,
    makeDetails: (u, r) => ({
      details: `${u.name} modified fee record — discount applied`,
      recordType: "Fee Record", recordLabel: r?.label,
      fieldsModified: ["Total Fee Amount", "Discount %"],
      beforeValue: { total: "SAR 15,000", discount: "0%" }, afterValue: { total: "SAR 12,000", discount: "20%" },
    }),
  },
  {
    action: "FEE_PAYMENT_RECORDED", module: "Finance", severity: "info", weight: 8,
    makeDetails: (u, r) => ({
      details: `${u.name} recorded fee payment`,
      recordType: "Payment Record", recordLabel: r?.label,
      fieldsModified: ["Payment Amount", "Receipt No", "Payment Date"],
      afterValue: { amount: "SAR 7,500", receipt: "RCP-2024-0021", date: "Jun 13" },
    }),
  },
  {
    action: "MESSAGE_SENT", module: "Messaging", severity: "info", weight: 15,
    makeDetails: (u) => ({
      details: `${u.name} sent internal message`,
      recordType: "Message",
      recordLabel: "Re: Ahmed's Physics performance",
    }),
  },
  {
    action: "ANNOUNCEMENT_CREATED", module: "Announcements", severity: "info", weight: 5,
    makeDetails: (u) => ({
      details: `${u.name} published school-wide announcement`,
      recordType: "Announcement",
      recordLabel: "End of Term Exam Schedule — All Grades",
      afterValue: { audience: "School Wide", category: "Academic", pinned: "true" },
    }),
  },
  {
    action: "MEETING_CREATED", module: "Meetings", severity: "info", weight: 4,
    makeDetails: (u) => ({
      details: `${u.name} scheduled a meeting`,
      recordType: "Meeting",
      recordLabel: "Parent-Teacher Meeting — End of Term 2",
      afterValue: { date: "Jun 15", room: "Main Conference Room", attendees: "6" },
    }),
  },
  {
    action: "REPORT_GENERATED", module: "Reports", severity: "medium", weight: 6,
    makeDetails: (u) => ({
      details: `${u.name} generated school performance report`,
      recordType: "Report",
      recordLabel: "Q2 School Performance Report — All Grades",
      fieldsViewed: ["Attendance Summary", "Grade Distribution", "Fee Collection", "At-Risk List"],
    }),
  },
  {
    action: "DATA_EXPORTED", module: "Data Export", severity: "high", weight: 2,
    makeDetails: (u) => ({
      details: `${u.name} exported student data to CSV — 1,247 records`,
      recordType: "Data Export",
      recordLabel: "All Students — Full Profile Export",
      fieldsViewed: ["Name", "DOB", "Address", "Parent Phone", "Grades", "Attendance", "Fee Status"],
    }),
  },
  {
    action: "TEACHER_PROFILE_VIEWED", module: "Students", severity: "low", weight: 6,
    makeDetails: (u) => ({
      details: `${u.name} viewed teacher profile`,
      recordType: "Teacher Profile",
      recordLabel: "Dr. Sarah Al-Hamdan — Mathematics",
      fieldsViewed: ["Qualifications", "Classes", "Performance Rating", "Attendance"],
    }),
  },
  {
    action: "SETTINGS_CHANGED", module: "Settings", severity: "medium", weight: 2,
    makeDetails: (u) => ({
      details: `${u.name} changed system settings`,
      recordType: "Settings",
      fieldsModified: ["Notification Preferences", "Language"],
      beforeValue: { notifications: "all", lang: "Arabic" }, afterValue: { notifications: "critical_only", lang: "English" },
    }),
  },
  {
    action: "PIN_UNLOCK", module: "Security", severity: "medium", weight: 3,
    makeDetails: (u) => ({
      details: `${u.name} used PIN to unlock session after 15-minute timeout`,
    }),
  },
  {
    action: "SESSION_EXPIRED", module: "Authentication", severity: "info", weight: 5,
    makeDetails: (u) => ({
      details: `${u.name} session expired due to inactivity — auto logged out`,
    }),
  },
  {
    action: "PASSWORD_RESET", module: "Security", severity: "high", weight: 1,
    makeDetails: (u) => ({
      details: `${u.name} account password was reset by IT Admin`,
      fieldsModified: ["Password Hash"],
      afterValue: { resetBy: "IT Admin", method: "Email OTP" },
    }),
  },
];

// ── Generator ─────────────────────────────────────────────────────────────────
function buildWeightedPool() {
  const pool: ActionTemplate[] = [];
  for (const t of actionTemplates) {
    for (let i = 0; i < t.weight; i++) pool.push(t);
  }
  return pool;
}

const templatePool = buildWeightedPool();

function generateEntry(index: number): AuditLogEntry {
  const dayOffset = hashNum(index * 41, 180);
  const { timestamp, date, time } = makeTimestamp(dayOffset, index);

  const userIdx = hashNum(index * 13, users.length);
  const u = users[userIdx];

  const tplIdx = hashNum(index * 29, templatePool.length);
  const tpl = templatePool[tplIdx];

  const studentIdx = hashNum(index * 7, studentRecords.length);
  const student = studentRecords[studentIdx];

  const deviceIdx = hashNum(index * 19, devices.length);
  const browserIdx = hashNum(index * 23, browsers.length);
  const ipIdx = hashNum(index * 31, ipPool.length);

  const made = tpl.makeDetails(u, student);
  const outcome = tpl.outcome ?? "success";

  return {
    id: `AUD-${String(index + 1).padStart(6, "0")}`,
    timestamp,
    date,
    time,
    userName: u.name,
    userRole: u.role,
    userAvatar: u.avatar,
    action: tpl.action,
    module: tpl.module,
    recordType: made.recordType,
    recordId: student.id,
    recordLabel: made.recordLabel,
    fieldsViewed: made.fieldsViewed,
    fieldsModified: made.fieldsModified,
    beforeValue: made.beforeValue,
    afterValue: made.afterValue,
    deviceType: devices[deviceIdx],
    browser: browsers[browserIdx],
    ipAddress: ipPool[ipIdx],
    sessionId: sessionId(index),
    severity: tpl.severity,
    details: made.details,
    outcome,
  };
}

// ── Memoised dataset (generated once) ─────────────────────────────────────────
let _cache: AuditLogEntry[] | null = null;

export function getAllAuditLogs(): AuditLogEntry[] {
  if (_cache) return _cache;
  _cache = Array.from({ length: 10247 }, (_, i) => generateEntry(i));
  // Sort newest first by index (lower index = newer in our offset scheme)
  _cache.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  return _cache;
}

export function getRecentAuditLogs(count = 100): AuditLogEntry[] {
  return getAllAuditLogs().slice(0, count);
}

export function getSensitiveAccessLogs(): AuditLogEntry[] {
  return getAllAuditLogs().filter((e) =>
    ["SENSITIVE_ADDRESS_VIEWED", "SENSITIVE_PHONE_VIEWED", "SENSITIVE_FEE_RECORD_VIEWED",
     "DATA_EXPORTED", "FEE_MODIFIED", "MARKS_EDITED"].includes(e.action)
  ).slice(0, 200);
}

export function getLoginHistory(): AuditLogEntry[] {
  return getAllAuditLogs().filter((e) =>
    ["LOGIN", "LOGOUT", "LOGIN_FAILED", "SESSION_EXPIRED", "PIN_UNLOCK"].includes(e.action)
  ).slice(0, 200);
}

export function getSecurityAlerts(): AuditLogEntry[] {
  return getAllAuditLogs().filter((e) =>
    ["critical", "high"].includes(e.severity) || e.outcome === "failed"
  ).slice(0, 100);
}

export function getActivityTimeline(count = 100): AuditLogEntry[] {
  return getAllAuditLogs().slice(0, count);
}

// Security dashboard aggregates (deterministic, not re-running full scan)
export const securityMetrics = {
  totalLogs: 10247,
  todayLogs: 312,
  failedLogins: 47,
  sensitiveAccesses: 189,
  gradeChanges: 23,
  feeModifications: 18,
  dataExports: 11,
  criticalAlerts: 8,
  highAlerts: 34,
  pinUnlocks: 62,
  uniqueUsers: 13,
  avgSessionMinutes: 38,
};

export const actionSummary: { action: string; count: number; trend: number }[] = [
  { action: "Student Profile Viewed", count: 2847, trend: 12 },
  { action: "Attendance Marked", count: 1923, trend: 5 },
  { action: "Login", count: 1542, trend: -3 },
  { action: "Message Sent", count: 1089, trend: 22 },
  { action: "Marks Entered", count: 876, trend: 8 },
  { action: "Fee Viewed", count: 654, trend: -1 },
  { action: "Report Generated", count: 312, trend: 45 },
  { action: "Data Exported", count: 11, trend: -60 },
];

export const topUsersByActivity: { name: string; role: string; avatar: string; actions: number; sensitiveActions: number }[] = [
  { name: "Admin Office", role: "Admin", avatar: "AO", actions: 1842, sensitiveActions: 89 },
  { name: "Dr. Sarah Al-Hamdan", role: "Teacher", avatar: "SA", actions: 1234, sensitiveActions: 23 },
  { name: "Ms. Reem Al-Harbi", role: "Vice Principal", avatar: "RA", actions: 987, sensitiveActions: 67 },
  { name: "Finance Officer", role: "Finance", avatar: "FO", actions: 876, sensitiveActions: 112 },
  { name: "Mr. Khalid Al-Mutairi", role: "Teacher", avatar: "KM", actions: 654, sensitiveActions: 18 },
  { name: "Dr. Khalid Al-Mansouri", role: "Principal", avatar: "DK", actions: 543, sensitiveActions: 34 },
  { name: "IT Admin", role: "IT", avatar: "IA", actions: 432, sensitiveActions: 201 },
];

export const moduleActivityBreakdown: { module: string; count: number; color: string }[] = [
  { module: "Students", count: 3421, color: "#6366f1" },
  { module: "Authentication", count: 2187, color: "#10b981" },
  { module: "Attendance", count: 1876, color: "#f59e0b" },
  { module: "Academics", count: 1234, color: "#3b82f6" },
  { module: "Messaging", count: 812, color: "#8b5cf6" },
  { module: "Finance", count: 487, color: "#ef4444" },
  { module: "Reports", count: 145, color: "#ec4899" },
  { module: "Data Export", count: 85, color: "#14b8a6" },
];

export const dailyActivityLast30Days: { day: string; total: number; sensitive: number }[] = Array.from({ length: 30 }, (_, i) => {
  const d = new Date("2024-06-13");
  d.setDate(d.getDate() - (29 - i));
  const label = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const total = 200 + hashNum(i * 17, 200);
  const sensitive = 5 + hashNum(i * 23, 15);
  return { day: label, total, sensitive };
});

export const aiSecurityResponses: Record<string, string> = {
  address: `🔐 **Sensitive Address Accesses — Last 30 Days:**\n\nTotal accesses: **47**\n\n| User | Role | Count | Last Access |\n|------|------|-------|-------------|\n| IT Admin | IT | 18 | Jun 13 09:42 AM |\n| Admin Office | Admin | 15 | Jun 13 08:30 AM |\n| Ms. Reem Al-Harbi | VP | 9 | Jun 12 02:15 PM |\n| Finance Officer | Finance | 5 | Jun 10 11:00 AM |\n\n⚠️ IT Admin accessed 18 addresses — above normal threshold. Recommend review.`,
  marks: `📊 **Marks Modified After Deadline:**\n\n23 instances found in the last 6 months.\n\n**Recent cases:**\n• Mr. Khalid Al-Mutairi — Physics (Omar Al-Ghamdi) changed 68→79 — Jun 5, 3:22 PM ⚠️\n• Dr. Sarah Al-Hamdan — Math (Sara Al-Qahtani) changed 71→78 — May 28, 4:10 PM\n• Dr. Layla Al-Anazi — Chem (Rayan Al-Khalidi) changed 59→65 — May 15, 1:05 PM\n\n🔍 All 3 cases were within 48h of deadline. No pattern of abuse detected.`,
  attendance: `📋 **Attendance Changes — Grade 10 This Week:**\n\n12 edits to submitted records found.\n\n• Dr. Sarah Al-Hamdan: 8 edits on Jun 10 (2 Absent→Present, 6 Late→Present)\n• Mr. Khalid Al-Mutairi: 4 edits on Jun 11 (4 Absent→Present)\n\nAll edits occurred during school hours. Most common reason logged: "Late arrival confirmed via gate scan."\n\n✅ No suspicious pattern — typical end-of-day reconciliation.`,
  sensitive: `🔒 **Top Sensitive Data Accessors — Last 30 Days:**\n\n| Rank | User | Accesses | Data Types |\n|------|------|----------|------------|\n| 1 | IT Admin | 201 | Addresses, Phones, Bank |\n| 2 | Finance Officer | 112 | Fee Records, Bank Details |\n| 3 | Admin Office | 89 | Phones, Addresses |\n| 4 | Ms. Reem Al-Harbi | 67 | Student Profiles, Phones |\n| 5 | Dr. Khalid Al-Mansouri | 34 | Reports, Fee Records |\n\n⚠️ IT Admin's access count (201) is 3.2× the next highest user. Consider access review.`,
  failed: `🚨 **Failed Login Analysis — Last 30 Days:**\n\n47 failed login attempts detected.\n\n• 32 attempts from known user accounts (password errors)\n• 11 attempts from unknown email addresses\n• 4 attempts from unusual IP addresses (flagged)\n\n**Flagged IPs:**\n• 203.45.67.89 — 4 attempts, non-school network\n• 178.23.45.12 — 2 attempts, overseas IP\n\n🔴 Recommend: Enable 2FA for all admin accounts.`,
};
