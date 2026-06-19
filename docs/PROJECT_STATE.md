# Tanweer — Project State Document
> Living document. Updated after each major development cycle.
> A new agent should read this file + `docs/DEMO_CREDENTIALS.md` to understand the full system without re-auditing the codebase.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript (strict) |
| UI | Shadcn UI + Radix UI + Tailwind CSS |
| State | Zustand (`useDataStore`, `useAuthStore`, `useRoleStore`, `useUIStore`, `usePinStore`) |
| Server State | TanStack React Query (wired, no real API yet) |
| Forms | React Hook Form + Zod |
| Icons | Lucide React |
| Theme | next-themes (dark/light ready) |
| Data | 100% mock data — no backend connected |
| Port | 5000 (`npm run dev`) |

---

## Completed Features

### Authentication & Roles
- Login page with email + password (7 demo accounts)
- OTP demo flow (UI-only, always accepts any 6 digits)
- Role-based routing: each role lands on its own dashboard
- Role switcher in sidebar (development convenience — shows all accessible roles for the active user)
- Session-level PIN gate (`PinGate` component) protecting sensitive student fields
  - 3-failure lockout, fires admin notification via `useDataStore.addNotification`

### Global Layout
- Sidebar with role-filtered navigation links
- Topbar with school logo, global search (client-side), notification bell, dark-mode toggle, user menu
- AI Assistant drawer (`AIDrawer`) — accessible from all pages via `useUIStore.toggleAiDrawer`
- Breadcrumb navigation on all interior pages via `PageHeader` component

### Admin Role (`/admin`)
- Dashboard: 8 live KPI cards (student count now reads from `useDataStore.students.length`)
- School health score banner with trend indicators
- At-risk student list (merged from mock admin data + live population filter)
- Activity timeline feed
- Fee collection trend chart (Recharts)
- Student demographic breakdown chart
- Expandable modals for full at-risk list and full activity timeline
- Alert/notification panel with severity badges

### VP Role (`/vp`) — Three VP accounts, grade-scoped
- VP dashboard: grade-scoped KPI cards, attendance charts, class performance overview
- Timetable management (`/vp/timetable`): full CRUD — add, edit, delete periods; persisted to `useDataStore.timetableEntries`; filtered by VP's grade range
- Teacher leave approvals (`/vp/leave`): approve/reject/request-info workflow with status badges

### Teacher Role (`/teacher`)
- Teacher dashboard: today's schedule card, upcoming homework, quick stats
- My Classes (`/teacher/classes`): live roster from `useDataStore.students` filtered to Grade 10-A; attendance status from `useDataStore.attendanceRecords`
- Attendance (`/teacher/attendance`): section-scoped attendance with status editing
- Homework (`/teacher/homework`): create/view homework assignments
- Leave requests (`/teacher/leave`): submit, track, cancel leave requests
- Performance (`/teacher/performance`): grade entry interface

### Parent Role (`/parent`)
- Parent dashboard: child info card, attendance summary donuts, recent activity
- Attendance (`/parent/attendance`): child's attendance log
- Marks (`/parent/marks`): subject-by-subject grade breakdown
- Timetable (`/parent/timetable`): read-only view of child's class schedule

### Student Role (`/student-view`)
- Student dashboard: homework summary, exam countdown, attendance donuts
- Marks, Homework, Projects, Timetable sub-pages

### Shared Modules (multi-role access)
- **Students** (`/students`): searchable, filterable list; add student modal; role-scoped via `filterStudentsForRole`
- **Student 360** (`/students/[id]`): tabbed profile — Overview, Academic, Attendance, Finance, Notes, Communications; sensitive sections behind PIN gate
- **Directory** (`/directory`): Students / Teachers / Parents tabs
- **Attendance** (`/attendance`): full role-scoped attendance management; bulk mark + per-record edit; persisted to `useDataStore.attendanceRecords`
- **Admissions** (`/admissions`): Kanban lead pipeline with 5 stages; add/move leads
- **Academics** (`/academics`): subjects list, class counts, timetable overview
- **Fees** (`/fees`): invoice list, payment status badges, collection summary
- **AI Insights** (`/ai-insights`): predictive risk alerts, trend charts, "Take Action" stubs
- **Announcements** (`/announcements`): create/view school-wide announcements; role-based audience targeting
- **Messages** (`/messages`): threaded chat UI; compose/reply; file attach stub
- **Tasks** (`/tasks`): personal task manager with priority and due-date tracking
- **Meetings** (`/meetings`): meeting scheduler with attendee selection
- **Notifications** (`/notifications`): notification center with read/unread state
- **Transport** (`/transport`, `/transport/vehicles`, `/transport/routes`, `/transport/reports`): read-only fleet and route management
- **Settings** (`/settings`): school info, notification preferences, security (UI stubs — not persisted)
- **Audit Log** (`/audit`): admin-only security event log

### Architecture & DX
- `useDataStore` — single Zustand store; all mutations emit structured `AppEvent` to `eventLog`
- `src/lib/permissions.ts` — all role-based data filtering centralised here; never inline
- `src/lib/systemHealth.ts` + `/system-health` — dev-only architecture validator page
- `src/lib/architectureRules.ts` + `devGuard.ts` + `StartupValidator.tsx` — runtime architecture enforcement

---

## Partial / Stub Features

| Feature | Status | Detail |
|---------|--------|--------|
| AI Insights "Take Action" | Stub | Buttons show toast; no workflow triggered |
| File Attachments (Messages, Announcements) | Stub | Shows "Not available in demo mode" toast |
| Settings persistence | Stub | Changes show success toast but reset on page refresh |
| Settings — Change Password | Stub | UI only, no auth mutation |
| Settings — Enable 2FA | Stub | UI only |
| OTP verification | Stub | Accepts any 6-digit code |
| Transport GPS tracking | Stub | Map card is a placeholder; no live location |
| Fees — payment processing | Stub | No payment gateway wired |

---

## Known Issues

> From QA Audit `plan/QA_AUDIT_REPORT.md` (June 2026). Severity: C = Critical, H = High, M = Medium, L = Low.

| ID | Severity | Role | Description | Status |
|----|----------|------|-------------|--------|
| AD-01 | ~~Critical~~ | Admin | `totalStudents` KPI was hardcoded 600 | **FIXED** — now reads `students.length` |
| VP-01 | ~~High~~ | VP | Timetable edits not persisted to store | **FIXED** — wired to `useDataStore.timetableEntries` |
| AT-01 | ~~High~~ | All | Attendance edits reset on navigation | **FIXED** — wired to `useDataStore.attendanceRecords` |
| TC-01 | ~~High~~ | Teacher | Class roster hardcoded, not from population | **FIXED** — reads live `useDataStore.students` |
| AD-04 | Medium | Admin | Settings page values not persisted | Open |
| PA-01 | Medium | Parent | Attendance log has hardcoded 2024 dates | Open |
| AI-01 | Medium | Admin | AI Insights risk count doesn't match at-risk population | Open |
| AI-02 | Medium | Admin | AI Insights KPIs are static strings | Open |
| P-01 | Medium | Teacher | `filterParentsForRole` returns whole grade, not section | Open |
| AD-02 | Medium | Admin | Fee collection rate is a static mock string | Open |
| ST-01 | Low | Student | `/ai-insights` briefly flashes admin page before redirect | Open |
| VP-02 | Low | VP | VP dashboard attendance chart uses static data | Open |
| TC-02 | Low | Teacher | Homework list in teacher dashboard is static | Open |

---

## Pending Work

- Connect real PostgreSQL + NestJS backend (architecture is designed for this)
- Replace all `useState` stubs in Settings with `useDataStore` persistence
- Replace parent attendance hardcoded dates with dynamic population data
- Fix scope leak in `filterParentsForRole` for teacher role
- Add real file upload to Messages and Announcements
- Wire AI Insights "Take Action" buttons to real store mutations
- Add transport GPS map (replace placeholder)
- Implement real payment processing in Fees module
- Multi-tenancy: tenant switching, school-level config isolation

---

## Demo Checklist

Use this to verify the demo is working before a presentation:

- [ ] Login as `admin@school.edu` / `Admin123!` — lands on `/admin`
- [ ] Admin KPI "Total Students" shows dynamic count (same number as Students list)
- [ ] Navigate to `/students` — student list loads with 600+ entries and search works
- [ ] Open any student profile → sensitive tabs (Finance, Notes) require PIN `1234`
- [ ] Switch role to VP1 → `/vp` dashboard shows only Grades 1–4 data
- [ ] Go to `/vp/timetable` → add a period, navigate away, return — entry persists
- [ ] Login as `teacher@school.edu` / `Teacher123!` → `/teacher`
- [ ] Go to `/teacher/classes` → roster shows real student names (not stubs)
- [ ] Go to `/attendance` → edit a student's status, navigate away, return — status persists
- [ ] Bulk-mark all students "Present" → all rows update
- [ ] Login as `parent@school.edu` / `Parent123!` → `/parent` shows Ahmed Al-Rashidi's data
- [ ] Login as `student@school.edu` / `Student123!` → `/student-view` dashboard loads
- [ ] Dark mode toggle works across all pages
- [ ] AI Assistant drawer opens from any page (Sparkles button or sidebar)
- [ ] `/system-health` loads with no architecture violations (dev only)

---

## Important Routes Reference

| Route | Access | Description |
|-------|--------|-------------|
| `/login` | Public | Auth entry point |
| `/admin` | Admin | Principal dashboard |
| `/vp` | VP1/VP2/VP3 | Grade-scoped VP dashboard |
| `/vp/timetable` | VP | Timetable CRUD |
| `/vp/leave` | VP | Teacher leave approvals |
| `/teacher` | Teacher | Teacher dashboard |
| `/teacher/classes` | Teacher | Live class roster |
| `/teacher/attendance` | Teacher | Section attendance |
| `/teacher/homework` | Teacher | Homework management |
| `/teacher/leave` | Teacher | Leave requests |
| `/teacher/performance` | Teacher | Grade entry |
| `/parent` | Parent | Parent dashboard |
| `/parent/attendance` | Parent | Child attendance log |
| `/parent/marks` | Parent | Child marks |
| `/parent/timetable` | Parent | Child timetable |
| `/student-view` | Student | Student dashboard |
| `/students` | Admin/VP/Teacher | Student directory |
| `/students/[id]` | Admin/VP/Teacher | Student 360 profile |
| `/directory` | Admin/VP/Teacher | Staff + parent directory |
| `/attendance` | All (scoped) | Shared attendance management |
| `/admissions` | Admin/VP | Lead pipeline |
| `/academics` | Admin/VP/Teacher | Subjects + timetable |
| `/fees` | Admin/VP | Fee invoices |
| `/ai-insights` | Admin/VP | AI risk analytics |
| `/announcements` | All | School announcements |
| `/messages` | All | Threaded messaging |
| `/tasks` | All | Personal task manager |
| `/meetings` | All | Meeting scheduler |
| `/notifications` | All | Notification centre |
| `/transport` | Admin/VP | Fleet overview |
| `/transport/vehicles` | Admin | Vehicle list |
| `/transport/routes` | Admin | Route management |
| `/transport/reports` | Admin | Transport reports |
| `/settings` | Admin | School settings |
| `/audit` | Admin | Security audit log |
| `/system-health` | Dev only | Architecture validator |
| `/admin/demo-guide` | Admin | In-app demo guide |

---

## Architecture Summary

```
src/
├── app/                     # Next.js App Router
│   ├── (auth)/login/        # Public auth page
│   └── (dashboard)/         # Protected layout + all role pages
├── components/
│   ├── ui/                  # Shadcn/Radix primitives
│   └── common/              # Sidebar, Topbar, AIDrawer, PageHeader, etc.
├── features/                # Feature-specific sub-components
├── lib/
│   ├── mockData/            # All seed data (credentials, population, transport, etc.)
│   ├── permissions.ts       # SINGLE SOURCE for all role-based data filtering
│   ├── systemHealth.ts      # Architecture validator (pure fn)
│   └── utils.ts             # cn(), formatters
├── store/                   # Zustand stores
│   ├── useDataStore.ts      # Master store — students, attendance, timetable, events
│   ├── useAuthStore.ts      # Session / user
│   ├── useRoleStore.ts      # Active role for role-switcher
│   ├── useUIStore.ts        # AI drawer, sidebar open state
│   └── usePinStore.ts       # PIN gate + lockout
└── types/                   # Global TypeScript types
```

**Key architectural rules (enforced by `architectureRules.ts` + `devGuard.ts`):**
1. All role-based filtering goes through `src/lib/permissions.ts` — never ad-hoc inline.
2. `useDataStore` is the single source of truth; every mutation emits an `AppEvent`.
3. No component imports directly from another component's internal files.

---

## Last Updated

June 19, 2026 — After QA Audit Phase; fixes AD-01, VP-01, AT-01, TC-01 applied and verified.
