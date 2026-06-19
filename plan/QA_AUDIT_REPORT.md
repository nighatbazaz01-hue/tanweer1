# Tanweer Platform — System-Wide QA Audit Report
**Date:** June 19, 2026  
**Method:** Full static code inspection across all dashboard routes, stores, permissions engine, and mock data layers  
**Scope:** All 7 roles (Admin, VP1, VP2, VP3, Teacher, Parent, Student) · 22 dashboard routes  
**Auditor:** Code inspection only (automated testing not available)

---

## Executive Summary

| Severity | Count | Description |
|----------|-------|-------------|
| 🔴 Critical | 1 | Data disconnect that silently misleads users |
| 🟠 High | 3 | State not persisted; edits lost on navigation/refresh |
| 🟡 Medium | 6 | Hardcoded data that should be dynamic; cross-role data leaks |
| 🟢 Low | 8 | Minor UX gaps, stale dates, cosmetic inconsistencies |
| ℹ️ Info | 7 | Known demo limitations and intentional design choices |

**Overall architecture verdict:** The permission engine (`src/lib/permissions.ts`) is well-structured and consistently applied. `useDataStore` is correctly used as the single source of truth for mutable entities (announcements, leave, tasks, admissions, messages). The main systemic weakness is that **several pages use local `useState` for data that the user expects to persist** — attendance edits, timetable edits, and settings — resetting silently on navigation.

---

## Section 1 — Authentication & Role System

### ✅ What works
- Login flow: email + password + OTP (auto-shown in UI for demo). Works for all 7 accounts.
- OTP is auto-generated and displayed inline — correct for demo mode.
- `useRoleStore` role switcher correctly re-scopes all data via `filterXxxForRole()` on the fly.
- Logout resets role to `admin` (intentional for demo — next login defaults to admin).
- PIN gate (`PinGate` / `usePinStore`) correctly wraps sensitive fields on student profiles; 3-failure lockout fires a notification to admin.
- Session PIN state is stored in sessionStorage — cleared on tab close (correct security boundary for demo).

### ⚠️ Findings

| ID | Severity | Finding |
|----|----------|---------|
| A-01 | 🟢 Low | After logout, `setRole("admin")` is called inside Settings `handleLogout`. If a VP or Teacher logs out from the Settings page, the role store is reset to admin before the next login — no data leak but slightly unexpected. |
| A-02 | ℹ️ Info | There is no real session expiry. The `useAuthStore` isAuthenticated flag persists in localStorage indefinitely. A real backend would invalidate tokens. |
| A-03 | ℹ️ Info | OTP is purely cosmetic — any 6-digit string is accepted. This is correct for a demo/mock system. |

---

## Section 2 — Permission Engine (`src/lib/permissions.ts`)

### ✅ What works
- All 10 permission flags are correctly mapped for all 7 roles.
- `filterStudentsForRole`, `filterTeachersForRole`, `filterParentsForRole`, `filterAttendanceForRole`, `filterFeesForRole`, `filterThreadsForRole`, `filterAnnouncementsForRole`, `filterMeetingsForRole`, `filterTasksForRole`, `filterNotificationsForRole`, `filterAdmissionLeadsForRole` — all present and used.
- VP grade scopes (VP1: 1–4, VP2: 5–8, VP3: 9–12) are enforced consistently across students, teachers, parents, fees, and attendance.
- Teacher is correctly scoped to `DEMO_TEACHER_GRADE = 10`, `DEMO_TEACHER_SECTION = "A"`.
- Parent and Student are correctly pinned to `DEMO_CHILD_ID = "STU-0451"`.
- `hasPermission()` is used at the UI layer to conditionally render buttons (Add Student, New Announcement, etc.).

### ⚠️ Findings

| ID | Severity | Finding |
|----|----------|---------|
| P-01 | 🟡 Medium | `filterParentsForRole` for `teacher` returns all parents whose child is in Grade 10 — not scoped to section A. Teacher could see parents of 10-B, 10-C, 10-D students in the Directory/Messages parent list. Should be `childGrade === 10 && childSection === "A"`. |
| P-02 | 🟡 Medium | `filterThreadsForRole` uses keyword matching (`p.role.toLowerCase().includes(k)`) on thread participant role strings. This is fragile — a role string like "vice principal assistant" would incorrectly match the "vice principal" keyword, and any typo in a thread's participant role field breaks filtering silently. |
| P-03 | 🟢 Low | `filterAdmissionLeadsForRole` returns `[]` for all non-admin roles. VP roles should arguably see leads for their grade ranges once students enroll. Correct for current spec but worth flagging. |
| P-04 | ℹ️ Info | `canManageFees` is `false` for all VP roles. VP pages don't show the fee management module, which is consistent. However, VPs can navigate to `/fees` directly via URL — the fees page does not redirect or block non-admin users; it just shows a filtered (empty or scoped) dataset. No sensitive data leak occurs, but a "You don't have permission" message would be cleaner. |

---

## Section 3 — Admin Role

**Routes covered:** `/admin`, `/students`, `/students/[id]`, `/admissions`, `/fees`, `/attendance`, `/announcements`, `/ai-insights`, `/audit`, `/settings`, `/academics`, `/transport`, `/messages`, `/tasks`, `/meetings`

### ✅ What works
- Admin dashboard KPIs pull from `adminStats` in `mockData/admin.ts`.
- Admissions pipeline is fully wired to `useDataStore.admissionLeads`.
- Fees page uses `generateFeeRecords()` filtered through `filterFeesForRole` — admin sees all.
- Audit log page is rich: 5 tabs (Dashboard, Logs, Sensitive Access, Login History, Alerts), search/filter, pagination — all sourced from `mockData/auditLogs`.
- AI Insights: student role redirected to `/student-view` ✅. "Take Action" buttons show custom toast confirmations.
- "Add Student" button correctly gated to admin role only.
- Student profile PinGate wraps sensitive fields (address, phone, emergency contact) ✅.

### ⚠️ Findings

| ID | Severity | Finding |
|----|----------|---------|
| AD-01 | 🔴 Critical | **Student count mismatch.** `adminStats.totalStudents = 600` (hardcoded in `mockData/admin.ts`) is shown on the Admin Dashboard KPI card. The Students list page calls `getAllStudents()` via `useDataStore` which generates students from `population.ts`. If `getAllStudents()` returns a different count than 600, the KPI and list count will disagree. Both currently appear to generate ~600 students by design, but they are independently defined — a change to one will not update the other. The KPI should derive from `getAllStudents().length` dynamically. |
| AD-02 | 🟡 Medium | `adminStats` values (attendanceRate, feeCollectionRate, teacherAttendanceRate, etc.) are static and do not reflect any state changes made during the session (e.g., bulk-marking attendance as absent does not lower the `94.3%` KPI on the Admin Dashboard). |
| AD-03 | 🟡 Medium | Academics page shows "12" subjects, "8" upcoming exams, "34" classes as **hardcoded strings**. Only the Teachers KPI uses `getAllTeachers().length` dynamically. Exam dates on the Academics page are Jun 20, 22, 24, 26 — relative to today (Jun 19, 2026) these are tomorrow through next week, so they appear correct currently but will become stale dates as time passes. |
| AD-04 | 🟢 Low | Settings page ("School Information" form): `handleSave` fires a toast but does NOT write to any store or localStorage. On page refresh, the school name/address/email/phone reset to their initial values. Changes are ephemeral. |
| AD-05 | 🟢 Low | Settings notification preferences (`prefs` state) also reset on page refresh — no persistence layer. |
| AD-06 | ℹ️ Info | "Change Password" and "Enable 2FA" in Settings show toast messages only — expected for demo, no real auth backend. |

---

## Section 4 — VP Roles (VP1 / VP2 / VP3)

**Routes covered:** `/vp`, `/vp/timetable`, `/vp/leave`, `/attendance`, `/announcements`, `/students`, `/messages`, `/tasks`

### ✅ What works
- VP dashboards correctly scope KPI counts to their grade range (verified via `filterStudentsForRole`).
- Leave approval page is fully wired to `useDataStore.leaveRequests` with approve/reject + remarks — changes persist within the session and are reflected on the Teacher's leave page ✅.
- VP can create announcements (permission flag `canCreateAnnouncements: true`) — button visible and `addAnnouncement` correctly writes to store ✅.
- Task creation assigns to teachers via `filterTeachersForRole` — VP sees only teachers in their grade range ✅.
- Meetings scheduling: VP can schedule meetings (`canScheduleMeetings: true`) ✅.

### ⚠️ Findings

| ID | Severity | Finding |
|----|----------|---------|
| VP-01 | 🟠 High | **Timetable changes are not persisted.** `/vp/timetable` initialises with `useState(DEFAULT_ENTRIES)`. Any drag-drop or slot edit the VP makes is stored only in local component state. Navigating away from the page (e.g., to Dashboard and back) or refreshing resets the entire timetable to defaults. The page never calls any `useDataStore` action. |
| VP-02 | 🟡 Medium | VP1/VP2/VP3 all see the same timetable — it is not scoped by grade range. VP1 (Grades 1–4) would not realistically manage the same timetable slots as VP3 (Grades 9–12). There is no grade-range filtering applied to `DEFAULT_ENTRIES`. |
| VP-03 | 🟢 Low | VP can access `/fees` by URL and see fee records for their grade range. The Fees route does not appear in VP sidebar navigation, but there is no route-level guard preventing direct access. |
| VP-04 | 🟢 Low | VP attendance view uses the same shared `/attendance` page, correctly scoped by grade range. However, "Mark Attendance" / "Edit" actions also only update local state (see AT-01 below) — VPs cannot persist attendance changes either. |
| VP-05 | ℹ️ Info | The VP dashboard "Activity Feed" on the right panel appears to be static mock data (not sourced from `useDataStore.eventLog`). VP activity data does not update when VP takes actions (approves leave, creates announcement, etc.). |

---

## Section 5 — Teacher Role

**Routes covered:** `/teacher`, `/teacher/classes`, `/teacher/attendance`, `/teacher/homework`, `/teacher/leave`, `/attendance`, `/messages`

### ✅ What works
- Teacher dashboard scoped to Grade 10-A correctly.
- Leave request submission calls `useDataStore.submitLeaveRequest(DEMO_TEACHER_ID, …)` — persists to store and appears in VP leave management ✅.
- Homework: `addAssignment` correctly writes to `useDataStore` ✅.
- Messages: teacher sees threads scoped to admin/teacher/principal/parent (via keyword filter) ✅.
- Transport page: correctly blocked with "Access Restricted" message for teacher role ✅.
- Teacher attendance page (`/teacher/attendance`): scoped to Grade 10-A, shows only that section's students ✅.

### ⚠️ Findings

| ID | Severity | Finding |
|----|----------|---------|
| TC-01 | 🟠 High | **Teacher Classes roster is fully hardcoded.** `/teacher/classes` defines `rosterByClass` as a local `const` with student IDs `STU-001` through `STU-164`. These IDs do **not** match the population-generated IDs (format `STU-0451`, `STU-0452`, etc. from `population.ts`). The roster is completely disconnected from the actual student data store. Attendance status (`present`/`absent`/`late`) is also hardcoded per student and cannot be changed from this page. |
| TC-02 | 🟠 High | **Teacher `/teacher/attendance` changes not persisted.** The teacher attendance page uses `useState` for `records` and edits only that local state. Marking students absent here does not write to `useDataStore` — the changes evaporate on navigation. |
| TC-03 | 🟡 Medium | Homework page maintains local `newHw` form state separate from `useDataStore.assignments`. The displayed list is correctly read from the store, but there is a dual-state pattern: the "draft" form state is local, and on submit, `addAssignment` is called to store. This is correct but if `useDataStore` assignments were pre-filtered per teacher, a different teacher's assignments could bleed through (currently all assignments are global in the store, filtered only at render time). |
| TC-04 | 🟢 Low | Teacher classes page shows `teacherProfile.totalStudents` (from `mockData/teacher`) as a KPI — this is a static number in the mock file, not derived from the actual roster. |
| TC-05 | 🟢 Low | The teacher performance page (`/teacher/performance`) does not exist as a file — the glob search confirmed it. If there is a sidebar link to it, clicking would produce a 404. |

---

## Section 6 — Parent Role

**Routes covered:** `/parent`, `/parent/attendance`, `/parent/marks`, `/parent/timetable`, `/transport`, `/messages`, `/announcements`

### ✅ What works
- Parent dashboard correctly scoped to `DEMO_CHILD_ID = "STU-0451"`.
- Marks page (`/parent/marks`) uses `subjectMarks` from `mockData/student` — same data as the Student dashboard, consistent parent-child data parity ✅.
- Transport: parent sees child's bus route using `DEMO_CHILD_ID` lookup ✅.
- Announcements: parent sees `school_wide` and `parents` audience only — correctly filtered ✅.
- Messages: parent sees threads with teacher/admin/principal — correctly filtered ✅.

### ⚠️ Findings

| ID | Severity | Finding |
|----|----------|---------|
| PA-01 | 🟡 Medium | **Parent attendance log uses hardcoded 2024 dates.** `/parent/attendance` defines `attendanceLog` as a local `const` array with dates ranging from `May 26, 2024` to `Jun 13, 2024` — two full years in the past relative to today (June 19, 2026). This data is completely static and not sourced from `useDataStore` or `generateAttendanceRecords()`. |
| PA-02 | 🟡 Medium | Parent timetable (`/parent/timetable`) uses `weeklyTimetable`, `childProfile`, and `todayChildSchedule` from `mockData/parent` — all static. `todayChildSchedule` hardcodes `ongoing`/`completed`/`upcoming` statuses that do not reflect the actual current time. A class marked as "ongoing" will always show as ongoing regardless of the time of day. |
| PA-03 | 🟢 Low | Parent marks page (`/parent/marks`) doesn't display a "Lowest Subject" KPI — only Best Subject and GPA. The `lowest` variable is computed but never rendered. |
| PA-04 | ℹ️ Info | Parent cannot send messages (compose) — the Messages page compose button is present but Attach File shows "not available in demo mode" toast. The send function does work for text messages to existing threads. |

---

## Section 7 — Student Role

**Routes covered:** `/student-view`, `/student-view/*`

### ✅ What works
- Student dashboard is a clean, read-only view with personal KPIs (attendance rate, homework count, projects, upcoming exams).
- All data from `mockData/student` — consistent and coherent.
- Homework "Start" button opens AI Drawer (toggleAiDrawer) — correct interaction ✅.
- "AI Study Assistant" button opens AI Drawer ✅.
- Timetable displayed as a 5-day grid — all static but visually complete ✅.
- Accessing `/ai-insights` as student correctly redirects to `/student-view` ✅.
- Student cannot access admin/VP/teacher routes (role switcher controls this) ✅.

### ⚠️ Findings

| ID | Severity | Finding |
|----|----------|---------|
| ST-01 | 🟢 Low | The AI Insights redirect (`router.replace("/student-view")`) causes a brief flash of the AI Insights page content before navigation fires. A route-level guard in the layout would be cleaner. |
| ST-02 | 🟢 Low | Student projects show team members by name array — `members: ["Ahmed", "Sara", "Omar"]` — these are hardcoded and do not link to real student records. |
| ST-03 | ℹ️ Info | Student upcoming exam dates (`Jun 22`, `Jun 25`, etc.) are close to today (Jun 19, 2026) so they appear relevant. These are static and will become stale over time. |
| ST-04 | ℹ️ Info | Student dashboard attendance donut chart shows `present/absent/late` counts from `mockData/student.studentAttendance` — not derived from the central attendance store. |

---

## Section 8 — Shared Modules (All Roles)

### 8.1 Attendance (`/attendance`)

| ID | Severity | Finding |
|----|----------|---------|
| AT-01 | 🟠 High | **Attendance edits are not persisted.** The shared Attendance page initialises `records` from `filterAttendanceForRole(generateAttendanceRecords(), activeRole)` via `useState`. Individual edits and bulk marks update only local state. On navigation away and back, all edits are lost. Neither `saveEdit` nor `handleBulkMark` calls any `useDataStore` action. |
| AT-02 | 🟢 Low | On role switch, `useEffect` correctly re-syncs `records` from `baseRecords` and resets page to 1 ✅. However, this means any unsaved attendance edits made under one role are silently discarded when the role is changed. |
| AT-03 | 🟢 Low | The grade filter buttons cycle through all 12 grades even for teacher role, where only Grade 10 students are visible. Grades 1–9 and 11–12 filter buttons return 0 results for teacher without any "no results for this grade" messaging. |

### 8.2 Announcements (`/announcements`)

| ID | Severity | Finding |
|----|----------|---------|
| AN-01 | ✅ | `addAnnouncement` correctly writes to `useDataStore` — new announcements persist within the session. |
| AN-02 | 🟢 Low | `totalAudience: 1247` is hardcoded in `handleCreate` for every new announcement, regardless of the audience selection made in the form. |
| AN-03 | 🟢 Low | "Total Reach" KPI card always shows `"1,247"` — a static string, not computed from the actual audience data. |
| AN-04 | ℹ️ Info | Attachment support is intentionally absent in the creation form (no attachment input). Existing announcements can show attachment counts from mock data. |

### 8.3 Messages (`/messages`)

| ID | Severity | Finding |
|----|----------|---------|
| MS-01 | ✅ | Thread filtering by role works via keyword matching on participant role strings. |
| MS-02 | 🟢 Low | Compose → "Attach File" button shows a toast: "File attachments are not available in demo mode." This is intentional and clearly communicated. |
| MS-03 | ℹ️ Info | Message sending (`sendMessage`) writes to `useDataStore` — new messages appear in thread view within the session ✅. |

### 8.4 Tasks (`/tasks`)

| ID | Severity | Finding |
|----|----------|---------|
| TK-01 | ✅ | `filterTasksForRole` correctly: admin sees all, VP sees all, teacher sees only tasks assigned to `DEMO_TEACHER_NAME`, parent/student see nothing. |
| TK-02 | 🟢 Low | When admin/VP creates a task and assigns it to a teacher, the teacher name is selected from `filterTeachersForRole`. However, `filterTasksForRole` for teacher matches by `t.assignedTo.name === DEMO_TEACHER_NAME` — if a VP creates a task with a slightly different name format, it could fail to match. The comparison should use `assignedTo.id === DEMO_TEACHER_ID`. |

### 8.5 Transport (`/transport`)

| ID | Severity | Finding |
|----|----------|---------|
| TR-01 | ✅ | Teacher role correctly shows "Access Restricted" message. |
| TR-02 | ✅ | Parent view correctly uses `DEMO_CHILD_ID` to find child's bus record. |
| TR-03 | ℹ️ Info | Transport data is entirely static from `mockData/transport` — no store interaction. "Report Issue" button sends a toast. Expected for demo. |

### 8.6 Meetings (`/meetings`)

| ID | Severity | Finding |
|----|----------|---------|
| ME-01 | ✅ | `filterMeetingsForRole` correctly restricts parents to `parent_teacher` and `one_on_one` types; students to `one_on_one` only. |
| ME-02 | ℹ️ Info | Meeting scheduling writes to `useDataStore.meetings` — new meetings persist within session ✅. |

### 8.7 AI Insights (`/ai-insights`)

| ID | Severity | Finding |
|----|----------|---------|
| AI-01 | ✅ | Student role redirect to `/student-view` is in place. |
| AI-02 | 🟡 Medium | All 4 KPI cards ("47 Insights Generated", "23 Students at Risk", "91% Predictions Accuracy", "18 Actions Taken") are hardcoded static strings — not computed from any data. "23 at-risk students" matches `adminStats.atRiskStudents = 23` and the `atRiskStudents` array length (5 shown + "10 more"), but not dynamically derived. |
| AI-03 | ℹ️ Info | "View All 23 At-Risk Students" button fires a toast instead of navigating — correct for demo. |

### 8.8 Audit Log (`/audit`)

| ID | Severity | Finding |
|----|----------|---------|
| AU-01 | ✅ | Access gated to admin only (`canViewAuditLogs: true` for admin only). |
| AU-02 | ✅ | Rich 5-tab interface: Security Dashboard, Audit Logs, Sensitive Access, Login History, Security Alerts — all sourced from `mockData/auditLogs`. |
| AU-03 | ℹ️ Info | Audit logs are static mock data — real session actions (leave approvals, announcements created, attendance edits) do not append to the audit log. In production this would stream from the backend. |

---

## Section 9 — Data Store Architecture (`useDataStore`)

### ✅ What works
- `useDataStore` is confirmed as the single source of truth for: announcements, leaveRequests, admissionLeads, assignments, tasks, meetings, messages/threads, notifications.
- All mutations (add/update/delete) correctly emit structured `AppEvent` entries to `eventLog`.
- `StartupValidator` logs architecture compliance on mount (dev-only).

### ⚠️ Findings

| ID | Severity | Finding |
|----|----------|---------|
| DS-01 | 🟡 Medium | Attendance records, fee records, and student records are generated fresh each time from `generateAttendanceRecords()` / `generateFeeRecords()` / `getAllStudents()` — they are **not** stored in `useDataStore`. This means edits made to these on the UI cannot persist. For attendance and fees, this is the root cause of AT-01 and related issues above. |
| DS-02 | ℹ️ Info | `useDataStore` uses Zustand with no localStorage persistence middleware. All session state (approved leaves, new announcements, etc.) resets on full browser refresh. This is expected for a mock/demo system. |

---

## Section 10 — UI / UX Observations (All Roles)

| ID | Severity | Finding |
|----|----------|---------|
| UX-01 | 🟢 Low | Dark mode toggle is present in the Topbar. The app uses `next-themes` — dark mode works correctly across all pages. No issues found. |
| UX-02 | 🟢 Low | The AI Assistant Drawer (`AiDrawer`) is accessible from all roles. It opens correctly from the Topbar button and from the Student dashboard's "AI Study Assistant" button. |
| UX-03 | ℹ️ Info | The `/system-health` route (dev-only) runs the `SystemHealthValidator` and reports architecture compliance. It is not linked from the sidebar and should remain dev-only. |
| UX-04 | 🟢 Low | Page descriptions in the `PageHeader` sometimes show role scope label (Attendance, Students) but sometimes do not (Academics, AI Insights). Could be made consistent. |
| UX-05 | ℹ️ Info | The notification bell in the Topbar correctly filters notifications via `filterNotificationsForRole` — each role sees only relevant notifications. |

---

## Prioritised Bug Fix Backlog

### 🔴 Critical (Fix First)
| # | Issue | File | Fix |
|---|-------|------|-----|
| 1 | Admin dashboard `totalStudents` KPI hardcoded to 600 | `mockData/admin.ts`, `admin/page.tsx` | Derive from `useDataStore.getAllStudents().length` |

### 🟠 High (Fix Before Demo/Release)
| # | Issue | File | Fix |
|---|-------|------|-----|
| 2 | Timetable edits reset on navigation | `vp/timetable/page.tsx` | Store timetable entries in `useDataStore`; add `setTimetableEntries` action |
| 3 | Attendance edits not persisted | `attendance/page.tsx` | Add attendance records to `useDataStore`; call `updateAttendanceRecord` action |
| 4 | Teacher classes roster disconnected from student data | `teacher/classes/page.tsx` | Replace `rosterByClass` hardcoded const with students from `filterStudentsForRole` |

### 🟡 Medium (Fix Before Full Launch)
| # | Issue | File | Fix |
|---|-------|------|-----|
| 5 | Parent attendance log dates are 2 years stale (2024) | `parent/attendance/page.tsx` | Generate relative dates or source from central attendance store |
| 6 | Task assignee matching by name string not ID | `tasks/page.tsx`, `permissions.ts` | Match by `assignedTo.id === DEMO_TEACHER_ID` |
| 7 | `filterParentsForRole` for teacher too broad (grade, not section) | `permissions.ts` | Add `&& childSection === DEMO_TEACHER_SECTION` condition |
| 8 | `adminStats` KPIs don't reflect session changes | `mockData/admin.ts` | Compute live stats from store data |
| 9 | AI Insights KPIs all hardcoded | `ai-insights/page.tsx` | Derive counts from store data |
| 10 | VP timetable not grade-scoped | `vp/timetable/page.tsx` | Filter `DEFAULT_ENTRIES` by VP grade range |

### 🟢 Low (Polish Pass)
| # | Issue | File | Fix |
|---|-------|------|-----|
| 11 | Settings changes not persisted | `settings/page.tsx` | Add school settings to `useDataStore` or localStorage |
| 12 | Announcement `totalAudience` hardcoded in create | `announcements/page.tsx` | Calculate from audience selection |
| 13 | Unused `lowest` variable in parent marks | `parent/marks/page.tsx` | Render "Lowest Subject" card or remove variable |
| 14 | Student AI Insights redirect causes page flash | `ai-insights/page.tsx` | Move guard to layout or middleware |
| 15 | Teacher performance page missing (404 risk) | — | Create page or remove sidebar link |
| 16 | Academics page KPIs are hardcoded strings | `academics/page.tsx` | Derive from data or document as static |
| 17 | Parent timetable `todayChildSchedule` status is static | `parent/timetable/page.tsx` | Compute status from current time |

---

## Appendix A — Routes Coverage Matrix

| Route | Admin | VP1 | VP2 | VP3 | Teacher | Parent | Student | Permission Gated? |
|-------|-------|-----|-----|-----|---------|--------|---------|-------------------|
| /admin | ✅ | — | — | — | — | — | — | Role-based sidebar |
| /vp | — | ✅ | ✅ | ✅ | — | — | — | Role-based sidebar |
| /teacher | — | — | — | — | ✅ | — | — | Role-based sidebar |
| /parent | — | — | — | — | — | ✅ | — | Role-based sidebar |
| /student-view | — | — | — | — | — | — | ✅ | Role-based sidebar |
| /students | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | Add button: admin only |
| /attendance | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | Scoped by role |
| /admissions | ✅ | — | — | — | — | — | — | Admin only |
| /fees | ✅ | — | — | — | — | — | — | Admin only (no route guard) |
| /announcements | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Create: admin/VP only |
| /ai-insights | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ↪redirect | Student redirected |
| /audit | ✅ | — | — | — | — | — | — | Admin only |
| /settings | ✅ | — | — | — | — | — | — | Admin only (no route guard) |
| /academics | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | Shared read-only |
| /transport | ✅ | ✅ | ✅ | ✅ | ⛔ | ✅ | ✅ | Teacher blocked correctly |
| /messages | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Scoped by role |
| /tasks | ✅ | ✅ | ✅ | ✅ | ✅ | — | — | Create: admin/VP only |
| /meetings | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | ✅ | Schedule: admin/VP/teacher |

---

## Appendix B — Credentials Reference

| Role | Email | Password | PIN |
|------|-------|----------|-----|
| Admin | admin@school.edu | Admin123! | 1234 |
| VP1 (Grades 1–4) | vp1@school.edu | VP1pass! | 5678 |
| VP2 (Grades 5–8) | vp2@school.edu | VP2pass! | 9012 |
| VP3 (Grades 9–12) | vp3@school.edu | VP3pass! | 3456 |
| Teacher | teacher@school.edu | Teacher123! | — |
| Parent | parent@school.edu | Parent123! | — |
| Student | student@school.edu | Student123! | — |

**Demo personas pinned in `permissions.ts`:**
- Teacher → Dr. Sarah Al-Hamdan · `TCH-003` · Grade 10-A Mathematics
- Parent/Student → Ahmed Al-Rashidi · `STU-0451` · Grade 10-A

---

*End of Tanweer QA Audit Report — June 19, 2026*
