---
name: Permission Engine
description: Centralized role-based data access layer; rules for what each role can see
---

## Location
`src/lib/permissions.ts`

## Role → Data Access Rules
- `admin`: sees ALL data school-wide
- `vp1`: grades 1–4 only
- `vp2`: grades 5–8 only
- `vp3`: grades 9–12 only
- `teacher`: demo persona = Dr. Sarah Al-Hamdan, Grade 10-A only
- `parent`: demo persona = Ahmed Al-Rashidi, STU-0451 only
- `student`: demo persona = Ahmed Al-Rashidi, STU-0451 only

## Demo Persona Constants
```typescript
export const DEMO_TEACHER_NAME = "Dr. Sarah Al-Hamdan";
export const DEMO_TEACHER_GRADE = 10;
export const DEMO_TEACHER_SECTION = "A";
export const DEMO_CHILD_ID = "STU-0451";
export const DEMO_CHILD_NAME = "Ahmed Al-Rashidi";
```

## Exported Filter Functions
- `filterStudentsForRole(students, role)` — used in students/page, directory/students
- `filterTeachersForRole(teachers, role)` — used in directory/teachers
- `filterParentsForRole(parents, role)` — used in directory/parents
- `filterAttendanceForRole(records, role)` — used in attendance/page
- `filterFeesForRole(records, role)` — used in fees/page
- `filterThreadsForRole(threads, role)` — used in messages/page
- `filterAnnouncementsForRole(announcements, role)` — used in announcements/page
- `filterMeetingsForRole(meetings, role)` — used in meetings/page
- `filterTasksForRole(tasks, role)` — used in tasks/page
- `filterNotificationsForRole(notifications, role)` — used in notifications/page
- `filterAdmissionLeadsForRole(leads, role)` — admin-only
- `hasPermission(role, flag)` — checks ROLE_PERMISSIONS flags for UI gating
- `getRoleScopeLabel(role)` — returns human-readable scope string for page headers

## Why
Without a single canonical filter per entity, each page implemented its own ad-hoc role checks inconsistently, leading to data leakage across roles in the mock system.

## How to Apply
Import the relevant filter function from @/lib/permissions and apply it right after fetching raw data (useMemo wrapping for derived state). Do NOT reimplement role checks inline.
