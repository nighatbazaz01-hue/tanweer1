/**
 * Centralized Permission Engine — Tanweer Platform
 *
 * Single source of truth for role-based data access rules.
 * All pages and components MUST filter data through these functions.
 * Direct access to raw mock arrays without filtering is not permitted.
 */

import type { AppRole } from "@/store/useRoleStore";
import type { Student, Teacher, Parent, PopulationFeeRecord, PopulationAttendanceRecord } from "@/lib/mockData/population";
import type { Thread } from "@/lib/mockData/messages";
import type { Announcement } from "@/lib/mockData/announcements";
import type { Meeting } from "@/lib/mockData/meetings";
import type { Task } from "@/lib/mockData/tasks";
import type { Notification } from "@/lib/mockData/notifications";
import type { AdmissionLead } from "@/types";

// ─── Grade Ranges per VP Role ─────────────────────────────────────────────────
export const VP_GRADE_RANGES: Record<"vp1" | "vp2" | "vp3", [number, number]> = {
  vp1: [1, 4],
  vp2: [5, 8],
  vp3: [9, 12],
};

// ─── Demo Persona Bindings (mock system) ──────────────────────────────────────
// Teacher persona: Dr. Sarah Al-Hamdan teaches Grade 10-A Mathematics
// TCH-003 is pinned in population.ts getAllTeachers() at i=2 (grades 9–12 group)
export const DEMO_TEACHER_ID    = "TCH-003";
export const DEMO_TEACHER_NAME  = "Dr. Sarah Al-Hamdan";
export const DEMO_TEACHER_GRADE = 10;
export const DEMO_TEACHER_SECTION: "A" | "B" | "C" | "D" = "A";

// Parent/Student persona: Ahmed Al-Rashidi, Grade 10-A, STU-0451
export const DEMO_CHILD_ID = "STU-0451";
export const DEMO_CHILD_NAME = "Ahmed Al-Rashidi";

// ─── Feature Permission Flags ─────────────────────────────────────────────────
export interface RolePermissions {
  canSeeAllStudents: boolean;
  canSeeAllTeachers: boolean;
  canSeeAllParents: boolean;
  canCreateAnnouncements: boolean;
  canScheduleMeetings: boolean;
  canCreateTasks: boolean;
  canManageFees: boolean;
  canViewAuditLogs: boolean;
  canManageAdmissions: boolean;
  canViewAttendanceAll: boolean;
}

export const ROLE_PERMISSIONS: Record<AppRole, RolePermissions> = {
  admin:   { canSeeAllStudents: true,  canSeeAllTeachers: true,  canSeeAllParents: true,  canCreateAnnouncements: true,  canScheduleMeetings: true,  canCreateTasks: true,  canManageFees: true,  canViewAuditLogs: true,  canManageAdmissions: true,  canViewAttendanceAll: true  },
  vp1:     { canSeeAllStudents: false, canSeeAllTeachers: false, canSeeAllParents: false, canCreateAnnouncements: true,  canScheduleMeetings: true,  canCreateTasks: true,  canManageFees: false, canViewAuditLogs: false, canManageAdmissions: false, canViewAttendanceAll: false },
  vp2:     { canSeeAllStudents: false, canSeeAllTeachers: false, canSeeAllParents: false, canCreateAnnouncements: true,  canScheduleMeetings: true,  canCreateTasks: true,  canManageFees: false, canViewAuditLogs: false, canManageAdmissions: false, canViewAttendanceAll: false },
  vp3:     { canSeeAllStudents: false, canSeeAllTeachers: false, canSeeAllParents: false, canCreateAnnouncements: true,  canScheduleMeetings: true,  canCreateTasks: true,  canManageFees: false, canViewAuditLogs: false, canManageAdmissions: false, canViewAttendanceAll: false },
  teacher: { canSeeAllStudents: false, canSeeAllTeachers: false, canSeeAllParents: false, canCreateAnnouncements: false, canScheduleMeetings: true,  canCreateTasks: false, canManageFees: false, canViewAuditLogs: false, canManageAdmissions: false, canViewAttendanceAll: false },
  parent:  { canSeeAllStudents: false, canSeeAllTeachers: false, canSeeAllParents: false, canCreateAnnouncements: false, canScheduleMeetings: false, canCreateTasks: false, canManageFees: false, canViewAuditLogs: false, canManageAdmissions: false, canViewAttendanceAll: false },
  student: { canSeeAllStudents: false, canSeeAllTeachers: false, canSeeAllParents: false, canCreateAnnouncements: false, canScheduleMeetings: false, canCreateTasks: false, canManageFees: false, canViewAuditLogs: false, canManageAdmissions: false, canViewAttendanceAll: false },
};

/** Check a single permission flag for a role */
export function hasPermission(role: AppRole, flag: keyof RolePermissions): boolean {
  return ROLE_PERMISSIONS[role][flag];
}

// ─── Data Filter Functions ─────────────────────────────────────────────────────

export function filterStudentsForRole(students: Student[], role: AppRole): Student[] {
  switch (role) {
    case "admin":   return students;
    case "vp1":     return students.filter((s) => s.grade >= 1 && s.grade <= 4);
    case "vp2":     return students.filter((s) => s.grade >= 5 && s.grade <= 8);
    case "vp3":     return students.filter((s) => s.grade >= 9 && s.grade <= 12);
    case "teacher": return students.filter((s) => s.grade === DEMO_TEACHER_GRADE && s.section === DEMO_TEACHER_SECTION);
    case "parent":  return students.filter((s) => s.id === DEMO_CHILD_ID);
    case "student": return students.filter((s) => s.id === DEMO_CHILD_ID);
    default:        return [];
  }
}

export function filterTeachersForRole(teachers: Teacher[], role: AppRole): Teacher[] {
  switch (role) {
    case "admin":   return teachers;
    case "vp1":     return teachers.filter((t) => t.assignedGrades.some((g) => g >= 1 && g <= 4));
    case "vp2":     return teachers.filter((t) => t.assignedGrades.some((g) => g >= 5 && g <= 8));
    case "vp3":     return teachers.filter((t) => t.assignedGrades.some((g) => g >= 9 && g <= 12));
    case "teacher": return teachers.filter((t) => t.id === DEMO_TEACHER_ID);
    default:        return [];
  }
}

export function filterParentsForRole(parents: Parent[], role: AppRole): Parent[] {
  switch (role) {
    case "admin":   return parents;
    case "vp1":     return parents.filter((p) => p.childGrade >= 1 && p.childGrade <= 4);
    case "vp2":     return parents.filter((p) => p.childGrade >= 5 && p.childGrade <= 8);
    case "vp3":     return parents.filter((p) => p.childGrade >= 9 && p.childGrade <= 12);
    case "teacher": return parents.filter((p) => p.childGrade === DEMO_TEACHER_GRADE);
    case "parent":  return parents.filter((p) => p.childId === DEMO_CHILD_ID);
    default:        return [];
  }
}

export function filterAttendanceForRole(
  records: PopulationAttendanceRecord[],
  role: AppRole
): PopulationAttendanceRecord[] {
  switch (role) {
    case "admin":   return records;
    case "vp1":     return records.filter((r) => r.grade >= 1 && r.grade <= 4);
    case "vp2":     return records.filter((r) => r.grade >= 5 && r.grade <= 8);
    case "vp3":     return records.filter((r) => r.grade >= 9 && r.grade <= 12);
    case "teacher": return records.filter((r) => r.grade === DEMO_TEACHER_GRADE && r.section === DEMO_TEACHER_SECTION);
    case "parent":  return records.filter((r) => r.studentId === DEMO_CHILD_ID);
    case "student": return records.filter((r) => r.studentId === DEMO_CHILD_ID);
    default:        return [];
  }
}

export function filterFeesForRole(records: PopulationFeeRecord[], role: AppRole): PopulationFeeRecord[] {
  switch (role) {
    case "admin":   return records;
    case "vp1":     return records.filter((r) => r.grade >= 1 && r.grade <= 4);
    case "vp2":     return records.filter((r) => r.grade >= 5 && r.grade <= 8);
    case "vp3":     return records.filter((r) => r.grade >= 9 && r.grade <= 12);
    case "teacher": return records.filter((r) => r.grade === DEMO_TEACHER_GRADE);
    case "parent":  return records.filter((r) => r.studentId === DEMO_CHILD_ID);
    case "student": return records.filter((r) => r.studentId === DEMO_CHILD_ID);
    default:        return [];
  }
}

export function filterThreadsForRole(threads: Thread[], role: AppRole): Thread[] {
  if (role === "admin") return threads;
  const roleKeywords: Record<string, string[]> = {
    vp1:     ["admin", "vice principal", "teacher", "principal"],
    vp2:     ["admin", "vice principal", "teacher", "principal"],
    vp3:     ["admin", "vice principal", "teacher", "principal"],
    teacher: ["admin", "teacher", "principal", "vice principal", "parent"],
    parent:  ["parent", "teacher", "admin", "principal"],
    student: ["student", "teacher"],
  };
  const keywords = (roleKeywords[role] || []).map((k) => k.toLowerCase());
  return threads.filter((t) =>
    t.participants.some((p) =>
      keywords.some((k) => p.role.toLowerCase().includes(k))
    )
  );
}

export function filterAnnouncementsForRole(announcements: Announcement[], role: AppRole): Announcement[] {
  if (role === "admin") return announcements;
  const audienceMap: Record<string, string[]> = {
    vp1:     ["school_wide", "teachers", "department"],
    vp2:     ["school_wide", "teachers", "department"],
    vp3:     ["school_wide", "teachers", "department"],
    teacher: ["school_wide", "teachers", "department"],
    parent:  ["school_wide", "parents"],
    student: ["school_wide", "students", "grade_specific"],
  };
  const allowed = audienceMap[role] || ["school_wide"];
  return announcements.filter((a) => a.audience.some((aud) => allowed.includes(aud)));
}

export function filterMeetingsForRole(meetings: Meeting[], role: AppRole): Meeting[] {
  if (role === "admin") return meetings;
  if (role === "parent") return meetings.filter((m) => ["parent_teacher", "one_on_one"].includes(m.type));
  if (role === "student") return meetings.filter((m) => m.type === "one_on_one");
  // teachers and VPs see all meetings
  return meetings;
}

export function filterTasksForRole(tasks: Task[], role: AppRole): Task[] {
  if (role === "admin") return tasks;
  if (role === "parent" || role === "student") return [];
  if (role === "teacher") {
    const teacherNames = [DEMO_TEACHER_NAME, "Mr. Khalid Al-Mutairi", "Mr. Faris Al-Shammari", "Mr. Hassan Al-Shehri"];
    return tasks.filter(
      (t) => teacherNames.includes(t.assignedTo.name) || teacherNames.includes(t.assignedBy.name)
    );
  }
  // VPs see all tasks
  return tasks;
}

export function filterNotificationsForRole(notifications: Notification[], role: AppRole): Notification[] {
  return notifications.filter((n) => n.roles.includes(role));
}

export function filterAdmissionLeadsForRole(leads: AdmissionLead[], role: AppRole): AdmissionLead[] {
  if (role === "admin") return leads;
  return [];
}

// ─── Scope Label Helper ───────────────────────────────────────────────────────
/** Returns a human-readable scope label for the current role */
export function getRoleScopeLabel(role: AppRole): string {
  switch (role) {
    case "admin":   return "All Grades (School-Wide)";
    case "vp1":     return "Grades 1–4";
    case "vp2":     return "Grades 5–8";
    case "vp3":     return "Grades 9–12";
    case "teacher": return `Grade ${DEMO_TEACHER_GRADE}-${DEMO_TEACHER_SECTION} (Assigned Class)`;
    case "parent":  return `${DEMO_CHILD_NAME} (My Child)`;
    case "student": return "My Records Only";
    default:        return "Unknown Scope";
  }
}
