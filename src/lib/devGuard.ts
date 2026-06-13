/**
 * Development Guard — Tanweer Platform
 *
 * Runtime architecture enforcement layer.
 * Runs automatically on app startup (mounted via StartupValidator).
 * Detects violations of the architecture contracts defined in architectureRules.ts.
 * All warnings are console-only — zero UI impact.
 *
 * IMPORTANT: This module is a no-op in production (NODE_ENV !== "development").
 */

import {
  ARCHITECTURE_RULES,
  EVENT_SCHEMA_REQUIRED,
  REGISTERED_EVENT_TYPES,
  type RuleId,
} from "@/lib/architectureRules";
import {
  getAllStudents,
  getAllTeachers,
  getAllParents,
  generateFeeRecords,
  generateAttendanceRecords,
} from "@/lib/mockData/population";
import {
  filterStudentsForRole,
  filterTeachersForRole,
  filterParentsForRole,
  filterAttendanceForRole,
  filterFeesForRole,
  filterThreadsForRole,
  filterAnnouncementsForRole,
  filterMeetingsForRole,
  filterTasksForRole,
  filterNotificationsForRole,
  DEMO_CHILD_ID,
  DEMO_TEACHER_ID,
  DEMO_TEACHER_GRADE,
  DEMO_TEACHER_SECTION,
} from "@/lib/permissions";
import type { Thread } from "@/lib/mockData/messages";
import type { Announcement } from "@/lib/mockData/announcements";
import type { Meeting } from "@/lib/mockData/meetings";
import type { Task } from "@/lib/mockData/tasks";
import type { Notification } from "@/lib/mockData/notifications";
import type { AdmissionLead } from "@/types";
import type { AppEvent } from "@/store/useDataStore";

// ─── Violation Type ───────────────────────────────────────────────────────────
export type ViolationSeverity = "error" | "warning" | "info";

export interface DevViolation {
  rule:     RuleId | string;
  severity: ViolationSeverity;
  context:  string;
  detail:   string;
  fix?:     string;
}

// ─── Store Snapshot (same shape as StoreSnapshot in systemHealth.ts) ──────────
export interface GuardSnapshot {
  threads:        Thread[];
  announcements:  Announcement[];
  meetings:       Meeting[];
  tasks:          Task[];
  notifications:  Notification[];
  admissionLeads: AdmissionLead[];
  eventLog:       AppEvent[];
}

// ─── Guard Entry Point ────────────────────────────────────────────────────────
/**
 * Run all architectural guards against the current store snapshot.
 * Logs a structured console report and returns all violations found.
 * Safe to call repeatedly — no side effects beyond console output.
 */
export function runDevGuard(snapshot: GuardSnapshot): DevViolation[] {
  if (process.env.NODE_ENV !== "development") return [];

  const violations: DevViolation[] = [];

  checkStoreCompleteness(snapshot, violations);
  checkEventSchema(snapshot.eventLog, violations);
  checkEventLogCap(snapshot.eventLog, violations);
  checkPopulationIntegrity(violations);
  checkRoleIsolation(snapshot, violations);
  checkPermissionEngineConnectivity(snapshot, violations);

  printReport(violations, snapshot);

  return violations;
}

// ─── Check: Store Completeness ────────────────────────────────────────────────
function checkStoreCompleteness(snap: GuardSnapshot, violations: DevViolation[]) {
  const collections: [keyof GuardSnapshot, number][] = [
    ["threads",        1],
    ["announcements",  1],
    ["meetings",       1],
    ["tasks",          1],
    ["notifications",  1],
    ["admissionLeads", 1],
  ];
  for (const [key, minLen] of collections) {
    const arr = snap[key] as unknown[];
    if (!Array.isArray(arr) || arr.length < minLen) {
      violations.push({
        rule:     "RULE-DATA-001",
        severity: "error",
        context:  `useDataStore.${key}`,
        detail:   `Store collection "${key}" is empty or missing. Expected ≥ ${minLen} entries, got ${arr?.length ?? 0}.`,
        fix:      `Ensure ${key} is seeded in useDataStore.ts initial state.`,
      });
    }
  }
}

// ─── Check: Event Schema ──────────────────────────────────────────────────────
function checkEventSchema(eventLog: AppEvent[], violations: DevViolation[]) {
  eventLog.forEach((evt, i) => {
    for (const field of EVENT_SCHEMA_REQUIRED) {
      if (!evt[field as keyof AppEvent]) {
        violations.push({
          rule:     "RULE-EVT-002",
          severity: "error",
          context:  `eventLog[${i}] — ${evt.id ?? "unknown"}`,
          detail:   `Event entry is missing required field: "${field}".`,
          fix:      `Ensure makeEvent() in useDataStore.ts always sets ${EVENT_SCHEMA_REQUIRED.join(", ")}.`,
        });
      }
    }
    if (evt.type && !REGISTERED_EVENT_TYPES.includes(evt.type as typeof REGISTERED_EVENT_TYPES[number])) {
      violations.push({
        rule:     "RULE-EVT-001",
        severity: "warning",
        context:  `eventLog[${i}] — ${evt.id}`,
        detail:   `Event type "${evt.type}" is not in the registered event type list.`,
        fix:      `Add "${evt.type}" to REGISTERED_EVENT_TYPES in architectureRules.ts.`,
      });
    }
  });
}

// ─── Check: EventLog Cap ──────────────────────────────────────────────────────
function checkEventLogCap(eventLog: AppEvent[], violations: DevViolation[]) {
  if (eventLog.length > 100) {
    violations.push({
      rule:     "RULE-EVT-003",
      severity: "warning",
      context:  "useDataStore.eventLog",
      detail:   `eventLog has ${eventLog.length} entries — exceeds cap of 100.`,
      fix:      "Ensure every set() call in useDataStore applies .slice(0, 100) after prepending.",
    });
  }
}

// ─── Check: Population Integrity ─────────────────────────────────────────────
function checkPopulationIntegrity(violations: DevViolation[]) {
  const students   = getAllStudents();
  const teachers   = getAllTeachers();
  const parents    = getAllParents();
  const attendance = generateAttendanceRecords();
  const fees       = generateFeeRecords();

  if (students.length !== 600) {
    violations.push({
      rule: "RULE-DATA-003", severity: "error",
      context: "getAllStudents()",
      detail: `Expected 600 students, got ${students.length}.`,
      fix: "Check population.ts seeding logic.",
    });
  }
  if (teachers.length !== 50) {
    violations.push({
      rule: "RULE-DATA-003", severity: "error",
      context: "getAllTeachers()",
      detail: `Expected 50 teachers, got ${teachers.length}.`,
      fix: "Check population.ts seeding logic.",
    });
  }
  if (parents.length !== students.length) {
    violations.push({
      rule: "RULE-DATA-003", severity: "warning",
      context: "getAllParents()",
      detail: `Parent count (${parents.length}) does not match student count (${students.length}).`,
      fix: "Each student should have exactly one parent entry.",
    });
  }
  if (attendance.length !== students.length) {
    violations.push({
      rule: "RULE-DATA-003", severity: "warning",
      context: "generateAttendanceRecords()",
      detail: `Attendance records (${attendance.length}) do not match student count (${students.length}).`,
      fix: "Attendance generator should produce exactly one record per student.",
    });
  }
  if (fees.length !== students.length) {
    violations.push({
      rule: "RULE-DATA-003", severity: "warning",
      context: "generateFeeRecords()",
      detail: `Fee records (${fees.length}) do not match student count (${students.length}).`,
      fix: "Fee generator should produce exactly one record per student.",
    });
  }
}

// ─── Check: Role Isolation ────────────────────────────────────────────────────
function checkRoleIsolation(snap: GuardSnapshot, violations: DevViolation[]) {
  const allStudents   = getAllStudents();
  const allAttendance = generateAttendanceRecords();
  const allFees       = generateFeeRecords();
  const allTeachers   = getAllTeachers();

  // Parent: sees only 1 student (DEMO_CHILD_ID)
  const parentStudents = filterStudentsForRole(allStudents, "parent");
  if (parentStudents.length !== 1 || parentStudents[0].id !== DEMO_CHILD_ID) {
    violations.push({
      rule: "RULE-PERM-001", severity: "error",
      context: "filterStudentsForRole(allStudents, 'parent')",
      detail: `Parent role sees ${parentStudents.length} students. Expected exactly 1 (${DEMO_CHILD_ID}).`,
      fix: "Check filterStudentsForRole() in permissions.ts — parent case.",
    });
  }

  // Parent: sees only 1 fee record
  const parentFees = filterFeesForRole(allFees, "parent");
  if (parentFees.length !== 1) {
    violations.push({
      rule: "RULE-PERM-001", severity: "error",
      context: "filterFeesForRole(allFees, 'parent')",
      detail: `Parent role sees ${parentFees.length} fee records. Expected exactly 1.`,
      fix: "Check filterFeesForRole() in permissions.ts — parent case.",
    });
  }

  // Student: sees only 1 attendance record
  const studentAttendance = filterAttendanceForRole(allAttendance, "student");
  if (studentAttendance.length !== 1 || studentAttendance[0].studentId !== DEMO_CHILD_ID) {
    violations.push({
      rule: "RULE-PERM-001", severity: "error",
      context: "filterAttendanceForRole(allAttendance, 'student')",
      detail: `Student role sees ${studentAttendance.length} attendance records. Expected 1 for ${DEMO_CHILD_ID}.`,
      fix: "Check filterAttendanceForRole() in permissions.ts — student case.",
    });
  }

  // Teacher: sees only Grade 10-A students
  const teacherStudents = filterStudentsForRole(allStudents, "teacher");
  const teacherBreach   = teacherStudents.filter(
    (s) => s.grade !== DEMO_TEACHER_GRADE || s.section !== DEMO_TEACHER_SECTION
  );
  if (teacherBreach.length > 0) {
    violations.push({
      rule: "RULE-PERM-001", severity: "error",
      context: "filterStudentsForRole(allStudents, 'teacher')",
      detail: `Teacher role sees ${teacherBreach.length} students outside Grade ${DEMO_TEACHER_GRADE}-${DEMO_TEACHER_SECTION}.`,
      fix: "Check filterStudentsForRole() in permissions.ts — teacher case.",
    });
  }

  // VP1: must not see grade 5+ students
  const vp1Students = filterStudentsForRole(allStudents, "vp1");
  const vp1Breach   = vp1Students.filter((s) => s.grade < 1 || s.grade > 4);
  if (vp1Breach.length > 0) {
    violations.push({
      rule: "RULE-PERM-001", severity: "error",
      context: "filterStudentsForRole(allStudents, 'vp1')",
      detail: `VP1 role sees ${vp1Breach.length} students outside grades 1–4.`,
      fix: "Check VP_GRADE_RANGES in permissions.ts.",
    });
  }

  // VP2: grades 5–8 only
  const vp2Students = filterStudentsForRole(allStudents, "vp2");
  const vp2Breach   = vp2Students.filter((s) => s.grade < 5 || s.grade > 8);
  if (vp2Breach.length > 0) {
    violations.push({
      rule: "RULE-PERM-001", severity: "error",
      context: "filterStudentsForRole(allStudents, 'vp2')",
      detail: `VP2 role sees ${vp2Breach.length} students outside grades 5–8.`,
      fix: "Check VP_GRADE_RANGES in permissions.ts.",
    });
  }

  // VP3: grades 9–12 only
  const vp3Students = filterStudentsForRole(allStudents, "vp3");
  const vp3Breach   = vp3Students.filter((s) => s.grade < 9 || s.grade > 12);
  if (vp3Breach.length > 0) {
    violations.push({
      rule: "RULE-PERM-001", severity: "error",
      context: "filterStudentsForRole(allStudents, 'vp3')",
      detail: `VP3 role sees ${vp3Breach.length} students outside grades 9–12.`,
      fix: "Check VP_GRADE_RANGES in permissions.ts.",
    });
  }

  // Admin: must see all students
  const adminStudents = filterStudentsForRole(allStudents, "admin");
  if (adminStudents.length !== 600) {
    violations.push({
      rule: "RULE-PERM-001", severity: "error",
      context: "filterStudentsForRole(allStudents, 'admin')",
      detail: `Admin role sees only ${adminStudents.length} students. Expected 600.`,
      fix: "Admin case in filterStudentsForRole() must return all students.",
    });
  }

  // Teacher: tasks — parent/student must see 0 tasks
  const parentTasks  = filterTasksForRole(snap.tasks, "parent");
  const studentTasks = filterTasksForRole(snap.tasks, "student");
  if (parentTasks.length > 0) {
    violations.push({
      rule: "RULE-PERM-001", severity: "error",
      context: "filterTasksForRole(tasks, 'parent')",
      detail: `Parent role sees ${parentTasks.length} tasks. Expected 0.`,
      fix: "Check filterTasksForRole() parent case in permissions.ts.",
    });
  }
  if (studentTasks.length > 0) {
    violations.push({
      rule: "RULE-PERM-001", severity: "error",
      context: "filterTasksForRole(tasks, 'student')",
      detail: `Student role sees ${studentTasks.length} tasks. Expected 0.`,
      fix: "Check filterTasksForRole() student case in permissions.ts.",
    });
  }

  // Announcements: student must NOT see teacher-only announcements
  const studentAnnouncements = filterAnnouncementsForRole(snap.announcements, "student");
  const teacherOnlyLeaked    = studentAnnouncements.filter(
    (a) => a.audience.length > 0 && a.audience.every((aud) => aud === "teachers" || aud === "department")
  );
  if (teacherOnlyLeaked.length > 0) {
    violations.push({
      rule: "RULE-PERM-001", severity: "error",
      context: "filterAnnouncementsForRole(announcements, 'student')",
      detail: `Student sees ${teacherOnlyLeaked.length} teacher-only announcements.`,
      fix: "Check filterAnnouncementsForRole() — student case must exclude 'teachers' and 'department' audience.",
    });
  }

  // Teacher role must see ONLY their assigned teachers in directory
  const teacherDirEntry = filterTeachersForRole(allTeachers, "teacher");
  if (teacherDirEntry.length !== 1) {
    violations.push({
      rule: "RULE-PERM-001", severity: "warning",
      context: "filterTeachersForRole(allTeachers, 'teacher')",
      detail: `Teacher sees ${teacherDirEntry.length} entries in teacher directory. Expected 1 (their own profile).`,
      fix: "Check filterTeachersForRole() teacher case in permissions.ts.",
    });
  }
}

// ─── Check: Permission Engine Connectivity ────────────────────────────────────
function checkPermissionEngineConnectivity(snap: GuardSnapshot, violations: DevViolation[]) {
  // Verify all filter functions return sane values for admin (all data)
  const allStudents   = getAllStudents();
  const allTeachers   = getAllTeachers();
  const allAttendance = generateAttendanceRecords();
  const allFees       = generateFeeRecords();
  const allParents    = getAllParents();

  const adminAccess = {
    students:      filterStudentsForRole(allStudents, "admin").length,
    teachers:      filterTeachersForRole(allTeachers, "admin").length,
    parents:       filterParentsForRole(allParents, "admin").length,
    attendance:    filterAttendanceForRole(allAttendance, "admin").length,
    fees:          filterFeesForRole(allFees, "admin").length,
    threads:       filterThreadsForRole(snap.threads, "admin").length,
    announcements: filterAnnouncementsForRole(snap.announcements, "admin").length,
    meetings:      filterMeetingsForRole(snap.meetings, "admin").length,
    tasks:         filterTasksForRole(snap.tasks, "admin").length,
    notifications: filterNotificationsForRole(snap.notifications, "admin").length,
  };

  for (const [entity, count] of Object.entries(adminAccess)) {
    if (count === 0) {
      violations.push({
        rule:     "RULE-PERM-001",
        severity: "error",
        context:  `filterXForRole(${entity}, 'admin')`,
        detail:   `Admin sees 0 ${entity} records — permission engine may be broken for this entity.`,
        fix:      `Check filter${entity.charAt(0).toUpperCase() + entity.slice(1)}ForRole() admin case in permissions.ts.`,
      });
    }
  }
}

// ─── Console Report Printer ───────────────────────────────────────────────────
function printReport(violations: DevViolation[], snap: GuardSnapshot) {
  const errors   = violations.filter((v) => v.severity === "error");
  const warnings = violations.filter((v) => v.severity === "warning");

  const LINE = "═".repeat(60);

  // eslint-disable-next-line no-console
  console.groupCollapsed(
    `%c[Tanweer DevGuard] Architecture validation — ${
      errors.length === 0 ? "✅ PASS" : `🚨 ${errors.length} ERROR(S)`
    } ${warnings.length > 0 ? `| ⚠️  ${warnings.length} WARNING(S)` : ""}`,
    errors.length > 0
      ? "color:#dc2626;font-weight:bold;font-size:13px"
      : "color:#16a34a;font-weight:bold;font-size:13px"
  );

  // eslint-disable-next-line no-console
  console.log(
    "%c" + LINE + "\n" +
    `Store snapshot: ${snap.threads.length} threads | ${snap.announcements.length} announcements | ` +
    `${snap.meetings.length} meetings | ${snap.tasks.length} tasks | ` +
    `${snap.notifications.length} notifications | ${snap.admissionLeads.length} leads | ` +
    `${snap.eventLog.length} events logged\n` + LINE,
    "color:#6b7280;font-size:11px"
  );

  if (violations.length === 0) {
    // eslint-disable-next-line no-console
    console.log(
      "%c✅ All architectural contracts verified. No violations found.",
      "color:#16a34a;font-weight:bold"
    );
  } else {
    for (const v of violations) {
      const prefix = v.severity === "error" ? "🚨 ERROR" : "⚠️  WARN ";
      const style  = v.severity === "error" ? "color:#dc2626" : "color:#d97706";
      // eslint-disable-next-line no-console
      console.log(
        `%c${prefix} [${v.rule}]\n  Context: ${v.context}\n  Detail:  ${v.detail}${v.fix ? `\n  Fix:     ${v.fix}` : ""}`,
        style
      );
    }
  }

  // Print rule definitions for any violated rules
  const violatedRuleIds = [...new Set(violations.map((v) => v.rule))];
  if (violatedRuleIds.length > 0) {
    // eslint-disable-next-line no-console
    console.groupCollapsed("%cViolated Rule Definitions", "color:#6b7280;font-size:11px");
    for (const id of violatedRuleIds) {
      const rule = ARCHITECTURE_RULES[id as RuleId];
      if (rule) {
        // eslint-disable-next-line no-console
        console.log(`[${rule.id}] ${rule.title}\n→ ${rule.description}`);
      }
    }
    // eslint-disable-next-line no-console
    console.groupEnd();
  }

  // eslint-disable-next-line no-console
  console.log(
    `%c\nSummary: ${errors.length} errors, ${warnings.length} warnings. See /system-health for full report.`,
    "color:#6b7280;font-size:11px"
  );
  // eslint-disable-next-line no-console
  console.groupEnd();
}
