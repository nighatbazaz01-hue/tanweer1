# Tanweer — Project State Document

> Living document. A new agent should read this + `docs/DEMO_CREDENTIALS.md` + `docs/AGENT_HANDOFF.md` to understand the full system.
> Last updated: June 19, 2026

---

## Tech Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Framework | Next.js 15 (App Router) | `src/app/` — layouts + pages |
| Language | TypeScript | Strict mode |
| UI | Shadcn UI + Radix UI + Tailwind CSS | Components in `src/components/ui/` |
| Global State | Zustand | 5 stores in `src/store/` |
| Server State | TanStack React Query | Wired but no real API yet |
| Forms | React Hook Form + Zod | Used in modals/dialogs |
| Icons | Lucide React | |
| Theme | next-themes | Dark/light mode ready |
| Data | Mock only | No backend connected |
| Dev Port | 5000 | `npm run dev` |

---

## Completed Features

### Authentication System
- Login page (`/login`) with email + password — validates against `MOCK_CREDENTIALS` in `credentials.ts`
- OTP demo flow — UI only, accepts any 6-digit code
- Role-based routing — each account lands on its own dashboard route
- Role switcher in sidebar — cycles through all roles accessible to the logged-in user
- Logout clears auth and role state, redirects to `/login`

### PIN Security System
- Session-level `PinGate` component wraps sensitive tabs on Student 360 profile
- 3-failure lockout → fires `addNotification` to admin via `useDataStore`
- `usePinStore` manages attempt count, locked state, and per-role PIN validation
- PIN verified against `getPinForRole(appRole)` — sourced from `credentials.ts`

### Permission Engine (`src/lib/permissions.ts`)
- Single source of truth for all role-based data filtering
- Functions: `filterStudentsForRole`, `filterTeachersForRole`, `filterParentsForRole`, `filterAttendanceForRole`, `filterFeesForRole`, `filterThreadsForRole`, `filterAnnouncementsForRole`, `filterMeetingsForRole`, `filterTasksForRole`, `filterNotificationsForRole`, `filterAdmissionLeadsForRole`
- `ROLE_PERMISSIONS` matrix — 11 boolean flags per role
- `VP_GRADE_RANGES`: vp1=[1,4], vp2=[5,8], vp3=[9,12]

### Admin Role (`/admin`)
- 8 KPI cards — "Total Students" now reads `students.length` from `useDataStore` (live, not hardcoded)
- School health score banner (87/100) with trend badge
- At-risk student list — merged from mock admin data + live population (`performanceTier === "at-risk"`)
- Activity timeline feed (20 items, expandable to 50)
- Fee collection trend chart (Recharts area chart)
- Student demographic breakdown chart
- Expandable modals for full at-risk list and full timeline

### VP Role (`/vp`) — 3 accounts, grade-scoped
- VP dashboard: grade-scoped KPI cards, attendance charts, class performance overview
- Timetable management (`/vp/timetable`): full CRUD (add, edit, delete); **persisted to `useDataStore.timetableEntries`**; filtered by VP's grade range via `VP_GRADE_RANGES`; 22 seed entries across grades 1, 5, 9, 10, 12
- Teacher leave approvals (`/vp/leave`): approve / reject / request-info workflow

### Teacher Role (`/teacher`)
- Teacher dashboard: today's schedule, upcoming homework, quick stats
- My Classes (`/teacher/classes`): roster from **live `useDataStore.students`** filtered by `filterStudentsForRole("teacher")` (Grade 10-A); attendance status from **live `useDataStore.attendanceRecords`**
- Section attendance (`/teacher/attendance`): attendance management for assigned section
- Homework management (`/teacher/homework`): create and view assignments
- Leave requests (`/teacher/leave`): submit, track, cancel leave requests
- Grade entry (`/teacher/performance`): marks entry interface

### Parent Role (`/parent`)
- Parent dashboard: child info card, attendance summary donuts, recent activity
- Child attendance log (`/parent/attendance`)
- Subject-by-subject grade breakdown (`/parent/marks`)
- Read-only timetable (`/parent/timetable`)

### Student Role (`/student-view`)
- Student dashboard: homework summary, exam countdown, attendance donuts
- Sub-pages: `/student-view/marks`, `/student-view/homework`, `/student-view/projects`, `/student-view/timetable`, `/student-view/attendance`, `/student-view/exams`

### Shared Modules
- **Students** (`/students`): searchable/filterable list with add-student modal; role-scoped
- **Student 360** (`/students/[id]`): tabbed profile — Overview, Academic, Attendance, Finance, Notes, Communications; Finance/Notes behind `PinGate`
- **Directory** (`/directory/students`, `/directory/teachers`, `/directory/parents`)
- **Attendance** (`/attendance`): role-scoped records from `useDataStore.attendanceRecords`; per-record edit and bulk-mark; **persisted to store**
- **Admissions** (`/admissions`): Kanban pipeline with 5 stages; add/move leads
- **Academics** (`/academics`): subjects list, class counts
- **Fees** (`/fees`): invoice list, payment status, collection summary
- **AI Insights** (`/ai-insights`): risk alerts, trend charts, recommended actions
- **Announcements** (`/announcements`): create/view; role-based audience targeting
- **Messages** (`/messages`): threaded chat; compose/reply
- **Tasks** (`/tasks`): personal task manager
- **Meetings** (`/meetings`): meeting scheduler with attendee selection
- **Notifications** (`/notifications`): notification centre with read/unread state
- **Transport** (`/transport`, `/transport/vehicles`, `/transport/routes`, `/transport/reports`): fleet and route management
- **Settings** (`/settings`): school info, notification prefs, security
- **Audit Log** (`/audit`): admin-only security event log
- **Demo Guide** (`/admin/demo-guide`): in-app walkthrough page
- **System Health** (`/system-health`): dev-only architecture validator

### Data Store (`useDataStore`)
- Single Zustand store — students (600), attendance records (600), timetable entries (22 seed), threads, announcements, meetings, tasks, notifications, admission leads, assignments, transport records, vehicles, transport requests, leave requests
- Every mutation emits a structured `AppEvent` to `eventLog` (capped at 100)
- Event types include: student CRUD, attendance updates, timetable CRUD, thread/announcement/meeting/task CRUD, leave request actions, transport request actions

---

## Partial / Stub Features

| Feature | Location | Behaviour |
|---------|----------|-----------|
| AI Insights "Take Action" buttons | `/ai-insights` | Shows success toast; no store mutation |
| File attachments | `/messages`, `/announcements` | "Not available in demo mode" toast |
| Settings persistence | `/settings` | Values reset on page refresh |
| Change Password | `/settings` | UI only — no auth mutation |
| Enable 2FA | `/settings` | UI only |
| OTP verification | `/login` | Accepts any 6-digit code |
| Transport GPS map | `/transport` | Placeholder card — no live location |
| Fees payment processing | `/fees` | No payment gateway wired |
| AI Insights risk count | `/ai-insights` | Static strings, not derived from live population |

---

## Known Issues

From QA Audit `plan/QA_AUDIT_REPORT.md` (June 2026):

| ID | Severity | Description | Status |
|----|----------|-------------|--------|
| AD-01 | Critical | `totalStudents` KPI hardcoded 600, not dynamic | **FIXED** — reads `students.length` |
| VP-01 | High | Timetable edits not persisted across navigation | **FIXED** — wired to `useDataStore.timetableEntries` |
| AT-01 | High | Attendance edits reset on navigation | **FIXED** — wired to `useDataStore.attendanceRecords` |
| TC-01 | High | Teacher class roster was hardcoded stubs | **FIXED** — reads live `useDataStore.students` |
| AD-04 | Medium | Settings page values not persisted | Open |
| PA-01 | Medium | Parent attendance log has hardcoded 2024 dates | Open |
| AI-01 | Medium | AI Insights risk count doesn't match live at-risk population | Open |
| AI-02 | Medium | AI Insights KPIs are static strings | Open |
| P-01 | Medium | `filterParentsForRole("teacher")` returns whole grade, not section | Open |
| AD-02 | Medium | Fee collection rate is a static mock string | Open |
| ST-01 | Low | `/ai-insights` briefly flashes admin page before redirect for student role | Open |
| VP-02 | Low | VP dashboard attendance chart uses static data | Open |
| TC-02 | Low | Homework list on teacher dashboard is static | Open |

---

## Pending Work

- Connect real PostgreSQL + NestJS backend (architecture already designed for this)
- Replace `useState` stubs in Settings with `useDataStore` persistence
- Fix parent attendance hardcoded 2024 dates to use `generateAttendanceRecords` dates
- Fix `filterParentsForRole("teacher")` to filter by section, not just grade (P-01)
- Wire AI Insights stats to live population data
- Add real file upload to Messages and Announcements
- Wire AI Insights "Take Action" buttons to store mutations
- Add transport GPS map (replace placeholder)
- Implement real payment processing in Fees
- Multi-tenancy: tenant switching, school-level config isolation
- Real backend: PostgreSQL (planned schema exists), NestJS API layer

---

## Demo Checklist

- [ ] Login `admin@school.edu` / `Admin123!` → lands on `/admin`
- [ ] Admin "Total Students" KPI matches count in `/students` list
- [ ] Open any student → Finance tab requires PIN `1234`
- [ ] 3 wrong PINs → lockout toast; admin notification appears
- [ ] Switch role to VP1 → `/vp` dashboard shows only Grades 1–4 data
- [ ] `/vp/timetable` → add a period, navigate away, return → entry persists
- [ ] `/attendance` → edit one student status → navigate away → status persists on return
- [ ] Bulk-mark all students "Absent" → all rows update, counter reflects change
- [ ] Login `teacher@school.edu` / `Teacher123!` → `/teacher/classes` shows real student names
- [ ] Login `parent@school.edu` / `Parent123!` → `/parent` shows Ahmed Al-Rashidi's data
- [ ] Login `student@school.edu` / `Student123!` → `/student-view` loads
- [ ] Dark mode toggle works across all pages
- [ ] AI Assistant drawer opens from any page
- [ ] `/system-health` shows no architecture violations

---

## Important Test Accounts

See `docs/DEMO_CREDENTIALS.md` for full credential details.

| Purpose | Email | Role |
|---------|-------|------|
| Full admin access | `admin@school.edu` | admin |
| PIN gate testing | `admin@school.edu` | admin — PIN: `1234` |
| Grade-scoped view (low grades) | `vp1@school.edu` | vp1 — Grades 1–4 |
| Grade-scoped view (high grades) | `vp3@school.edu` | vp3 — Grades 9–12 |
| Teacher class roster | `teacher@school.edu` | teacher — Grade 10-A |
| Parent child view | `parent@school.edu` | parent — child: STU-0451 |
| Student self-view | `student@school.edu` | student — STU-0451 |

---

## Important Routes

45 pages total (confirmed by `find src/app/(dashboard) -name "page.tsx"`):

| Route | Roles | Description |
|-------|-------|-------------|
| `/login` | Public | Auth entry point |
| `/dashboard` | All | Generic landing (redirects by role) |
| `/admin` | admin | Principal dashboard |
| `/admin/demo-guide` | admin | In-app demo walkthrough |
| `/vp` | vp1, vp2, vp3 | Grade-scoped VP dashboard |
| `/vp/timetable` | vp1, vp2, vp3 | Timetable CRUD (persisted) |
| `/vp/leave` | vp1, vp2, vp3 | Teacher leave approvals |
| `/teacher` | teacher | Teacher dashboard |
| `/teacher/classes` | teacher | Live class roster |
| `/teacher/attendance` | teacher | Section attendance |
| `/teacher/homework` | teacher | Homework management |
| `/teacher/leave` | teacher | Leave requests |
| `/teacher/performance` | teacher | Grade entry |
| `/parent` | parent | Parent dashboard |
| `/parent/attendance` | parent | Child attendance log |
| `/parent/marks` | parent | Child marks |
| `/parent/timetable` | parent | Child timetable |
| `/student-view` | student | Student dashboard |
| `/student-view/attendance` | student | Own attendance |
| `/student-view/exams` | student | Exam schedule |
| `/student-view/homework` | student | Homework list |
| `/student-view/marks` | student | Own marks |
| `/student-view/projects` | student | Projects |
| `/student-view/timetable` | student | Own timetable |
| `/students` | admin, vp*, teacher | Student directory |
| `/students/[id]` | admin, vp*, teacher | Student 360 profile |
| `/directory/students` | admin, vp*, teacher | Student directory tab |
| `/directory/teachers` | admin, vp*, teacher | Teacher directory tab |
| `/directory/parents` | admin, vp*, teacher | Parent directory tab |
| `/attendance` | All (scoped) | Shared attendance management |
| `/admissions` | admin | Lead pipeline Kanban |
| `/academics` | admin, vp*, teacher | Subjects + class counts |
| `/fees` | admin, vp* | Fee invoices |
| `/ai-insights` | admin, vp* | AI risk analytics |
| `/announcements` | All | School announcements |
| `/messages` | All | Threaded messaging |
| `/tasks` | admin, vp*, teacher | Task manager |
| `/meetings` | All | Meeting scheduler |
| `/notifications` | All | Notification centre |
| `/transport` | admin, vp* | Fleet overview |
| `/transport/vehicles` | admin | Vehicle list |
| `/transport/routes` | admin | Route management |
| `/transport/reports` | admin | Transport reports |
| `/settings` | admin | School settings |
| `/audit` | admin | Security audit log |
| `/system-health` | Dev only | Architecture validator |

---

## Recent Major Changes

| Date | Change | Files |
|------|--------|-------|
| Jun 19, 2026 | Fix AD-01: Admin KPI "Total Students" now reads `students.length` | `admin/page.tsx` |
| Jun 19, 2026 | Fix VP-01: VP timetable persisted to `useDataStore.timetableEntries` | `vp/timetable/page.tsx`, `useDataStore.ts` |
| Jun 19, 2026 | Fix AT-01: Attendance edits persisted to `useDataStore.attendanceRecords` | `attendance/page.tsx`, `useDataStore.ts` |
| Jun 19, 2026 | Fix TC-01: Teacher class roster uses live `useDataStore.students` | `teacher/classes/page.tsx` |
| Jun 19, 2026 | Store additions: `TimetableEntry` type, 22 seed entries, `timetableEntries`/`attendanceRecords` state, 5 new actions | `useDataStore.ts` |
| Jun 19, 2026 | QA Audit completed: 22 routes × 7 roles, 1 critical + 3 high + 10 medium + 17 low issues | `plan/QA_AUDIT_REPORT.md` |

---

## Current Architecture Summary

### Auth System
Login via `useAuthStore.login()` → `findCredential(email, password)` in `credentials.ts` → sets `user`, `appRole`, redirects to `targetRoute`. No real server — purely client-side mock.

### OTP Flow
After login, a simulated OTP screen appears. Accepts any 6-digit code. No real SMS/email sending.

### PIN System
`usePinStore` exposes `verifyPin(role, input)` → compares against `getPinForRole(appRole)` from `credentials.ts`. The `PinGate` component wraps sensitive content. 3 failures → `isLocked = true`, admin notification via `useDataStore.addNotification`.

### Permission Engine
All data filtering runs through `src/lib/permissions.ts`. Pages call `filterXForRole(data, activeRole)`. Direct access to raw mock arrays without filtering is an architecture violation (checked by `devGuard.ts`).

### Zustand Store (`useDataStore`)
Single store with full CRUD for: students, timetableEntries, attendanceRecords, threads, announcements, meetings, tasks, notifications, admissionLeads, assignments, transportRecords, vehicles, transportRequests, leaveRequests. Every mutation appends to `eventLog[]` (capped at 100).

### Event Log
`AppEvent = { id, type, actor, timestamp, payload }`. Types include 20+ event categories. All mutations use `makeEvent()` helper inside `useDataStore.ts`. Viewable at `/audit` (admin only).

### Transport Module
Read-only mock. `BUS_ROUTES` array (6 routes) + `VEHICLE_EXTRAS` (6 vehicles) combined into `initialVehicles` in `transport.ts`. Transport request CRUD is in the store (`transportRequests`). No GPS integration.

### AI Modules
`/ai-insights` is a visual demo — risk scores, trend charts, and alerts are static strings from `src/lib/mockData/admin.ts`. "Take Action" buttons show toast confirmations only. No ML model connected.
