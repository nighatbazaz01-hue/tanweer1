# Tanweer — Agent Handoff Document

> For a brand-new agent picking up this project after a session gap.
> Read this file, then `docs/DEMO_CREDENTIALS.md`, then `docs/PROJECT_STATE.md`.
> Last updated: June 19, 2026

---

## Project Overview

**Tanweer** is an AI-powered, multi-tenant SaaS School Management Platform built with Next.js 15.
- Demo school: **Al-Noor Academy** (600 students, grades 1–12)
- 7 user roles: admin, vp1, vp2, vp3, teacher, parent, student
- 100% mock data — no real backend. Architecture is designed for PostgreSQL + NestJS (not yet connected)
- All data lives in a single Zustand store (`useDataStore`). No API calls today.
- Running on port 5000 (`npm run dev`)

---

## Tech Stack

| | |
|-|-|
| Framework | Next.js 15, App Router (`src/app/`) |
| Language | TypeScript (strict) |
| UI | Shadcn UI + Radix UI + Tailwind CSS |
| State | Zustand (5 stores) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | Lucide React |
| Theme | next-themes (dark/light) |

---

## Folder Structure

```
src/
├── app/
│   ├── (auth)/
│   │   └── login/page.tsx          — Public login page
│   └── (dashboard)/
│       ├── layout.tsx              — Protected layout: Sidebar + Topbar + AIDrawer
│       ├── admin/page.tsx          — Principal dashboard
│       ├── vp/page.tsx             — VP grade-scoped dashboard
│       ├── vp/timetable/page.tsx   — VP timetable CRUD (persisted)
│       ├── vp/leave/page.tsx       — Teacher leave approvals
│       ├── teacher/page.tsx        — Teacher dashboard
│       ├── teacher/classes/page.tsx — Live roster from store
│       ├── teacher/attendance/     — Section attendance
│       ├── teacher/homework/       — Homework management
│       ├── teacher/leave/          — Leave request submission
│       ├── teacher/performance/    — Grade entry
│       ├── parent/page.tsx         — Parent dashboard
│       ├── parent/attendance/      — Child attendance view
│       ├── parent/marks/           — Child marks view
│       ├── parent/timetable/       — Child timetable view
│       ├── student-view/page.tsx   — Student dashboard
│       ├── student-view/[sub]/     — marks, homework, projects, timetable, attendance, exams
│       ├── students/page.tsx       — Student directory
│       ├── students/[id]/page.tsx  — Student 360 profile (PIN-gated tabs)
│       ├── directory/              — students, teachers, parents tabs
│       ├── attendance/page.tsx     — Shared attendance (role-scoped, persisted)
│       ├── admissions/page.tsx     — Kanban lead pipeline
│       ├── academics/page.tsx      — Subjects + class counts
│       ├── fees/page.tsx           — Fee invoices
│       ├── ai-insights/page.tsx    — AI risk analytics (mostly static)
│       ├── announcements/page.tsx  — Announcements CRUD
│       ├── messages/page.tsx       — Threaded messaging
│       ├── tasks/page.tsx          — Task manager
│       ├── meetings/page.tsx       — Meeting scheduler
│       ├── notifications/page.tsx  — Notification centre
│       ├── transport/page.tsx      — Fleet overview
│       ├── transport/vehicles/     — Vehicle list
│       ├── transport/routes/       — Route management
│       ├── transport/reports/      — Transport reports
│       ├── settings/page.tsx       — School settings (UI stubs, not persisted)
│       ├── audit/page.tsx          — Admin-only security event log
│       ├── system-health/page.tsx  — Dev-only architecture validator
│       └── admin/demo-guide/       — In-app demo walkthrough
│
├── components/
│   ├── ui/                         — Shadcn/Radix primitives (Button, Card, Dialog, etc.)
│   └── common/
│       ├── Sidebar.tsx             — Role-filtered nav links
│       ├── Topbar.tsx              — Search, notifications, dark-mode, user menu
│       ├── AIDrawer.tsx            — AI Assistant slide-in panel
│       ├── PageHeader.tsx          — Title + breadcrumbs + action slot
│       ├── StatsCard.tsx           — Reusable KPI card
│       └── PinGate.tsx             — PIN challenge overlay
│
├── features/                       — Feature-specific sub-components (per module)
│
├── lib/
│   ├── mockData/
│   │   ├── credentials.ts          — MOCK_CREDENTIALS array (7 accounts + PINs)
│   │   ├── population.ts           — generateStudentPopulation(), getAllStudents(),
│   │   │                             generateAttendanceRecords(), getAllTeachers(), getAllParents()
│   │   ├── transport.ts            — BUS_ROUTES, VEHICLE_EXTRAS, initialVehicles, initialTransportRequests
│   │   ├── admin.ts                — Admin KPI stats, at-risk list, activity timeline, fee chart
│   │   ├── teacher.ts              — todaysClasses, teacherProfile, DEMO_TEACHER_ID constants
│   │   ├── messages.ts             — mockThreads
│   │   ├── announcements.ts        — initialAnnouncements
│   │   ├── meetings.ts             — initialMeetings
│   │   ├── tasks.ts                — initialTasks
│   │   ├── notifications.ts        — allNotifications
│   │   └── (others)                — admissions, fees, leave, etc.
│   ├── permissions.ts              — ALL role-based data filtering (NEVER bypass this)
│   ├── systemHealth.ts             — Architecture validator (pure function)
│   ├── architectureRules.ts        — Rule contracts
│   └── utils.ts                    — cn(), date formatters
│
├── store/
│   ├── useDataStore.ts             — Master store (students, attendance, timetable, all entities)
│   ├── useAuthStore.ts             — Session: user, appRole, login(), logout()
│   ├── useRoleStore.ts             — Active role for UI (role switcher)
│   ├── useUIStore.ts               — AI drawer open state, sidebar state
│   └── usePinStore.ts              — PIN verification + lockout logic
│
└── types/
    └── index.ts                    — Global TS types (AdmissionLead, etc.)
```

---

## Auth Architecture

```
User fills login form
  → useAuthStore.login(email, password)
  → findCredential(email, password) in credentials.ts
  → If found: sets user, appRole, redirects to targetRoute
  → If not found: returns error message

On any protected page:
  → layout.tsx checks useAuthStore.isAuthenticated
  → If false: redirects to /login
```

**Key files:** `src/store/useAuthStore.ts`, `src/lib/mockData/credentials.ts`

There are 7 valid accounts. No "Transport Manager" role exists. See `docs/DEMO_CREDENTIALS.md`.

---

## OTP Flow

After login, a simulated OTP screen is shown. It accepts any 6-digit code (no real verification). This is a UI demo stub. The actual OTP component is in the login page flow.

---

## PIN Security Architecture

```
PinGate component wraps sensitive content (Finance, Notes tabs on Student 360)
  → Renders a PIN input overlay when content is "locked"
  → On submit: usePinStore.verifyPin(appRole, inputPin)
  → verifyPin calls getPinForRole(appRole) from credentials.ts
  → Match → unlocks for the session
  → Mismatch → increments attempt count
  → 3 failures → isLocked = true, fires useDataStore.addNotification to admin
```

**Key files:** `src/store/usePinStore.ts`, `src/components/common/PinGate.tsx`, `src/lib/mockData/credentials.ts`

---

## Permission Architecture

**RULE: ALL data filtering goes through `src/lib/permissions.ts`. No inline filters allowed.**

```typescript
// Correct — always use the permission engine
const visibleStudents = filterStudentsForRole(allStudents, activeRole);

// Wrong — never do this in a page/component
const myStudents = allStudents.filter(s => s.grade === 10);
```

The permission engine provides:
- `filterStudentsForRole(students, role)` — returns role-scoped student subset
- `filterAttendanceForRole(records, role)` — scopes to VP grade range or teacher section
- `filterTeachersForRole`, `filterParentsForRole`, `filterFeesForRole`, etc.
- `ROLE_PERMISSIONS[role]` — boolean feature flags (canManageFees, canViewAuditLogs, etc.)
- `VP_GRADE_RANGES` — `{vp1:[1,4], vp2:[5,8], vp3:[9,12]}`
- `DEMO_TEACHER_ID`, `DEMO_TEACHER_GRADE`, `DEMO_TEACHER_SECTION`, `DEMO_CHILD_ID`

Violations are caught at dev-time by `src/lib/devGuard.ts` + logged by `StartupValidator.tsx`.

---

## Store Architecture

`useDataStore` is the **single source of truth** for all mutable app data.

```typescript
// State slices
students: Student[]                          // 600 students, generated on init
timetableEntries: TimetableEntry[]           // 22 seed entries, fully CRUD-able
attendanceRecords: PopulationAttendanceRecord[] // 600 records, one per student
threads: Thread[]
announcements: Announcement[]
meetings: Meeting[]
tasks: Task[]
notifications: Notification[]
admissionLeads: AdmissionLead[]
assignments: Assignment[]
transportRecords: TransportRecord[]
vehicles: VehicleRecord[]
transportRequests: TransportRequest[]
leaveRequests: LeaveRequest[]
eventLog: AppEvent[]                         // capped at 100, append-only
```

Every mutation action:
1. Updates the relevant state slice
2. Creates an `AppEvent` via `makeEvent(type, actor, payload)`
3. Prepends it to `eventLog` (sliced to 100)

**Key file:** `src/store/useDataStore.ts`

---

## Event System

Every store mutation emits a structured event:

```typescript
interface AppEvent {
  id: string;           // auto-generated uuid
  type: AppEventType;   // e.g. "attendanceRecordUpdated", "timetableEntryAdded"
  actor: string;        // user name or role string
  timestamp: string;    // ISO string
  payload: Record<string, unknown>;
}
```

Event types (20+): `studentAdded`, `studentUpdated`, `attendanceSaved`, `attendanceRecordUpdated`, `bulkAttendanceUpdated`, `timetableEntryAdded`, `timetableEntryUpdated`, `timetableEntryDeleted`, `threadCreated`, `announcementPublished`, `meetingScheduled`, `taskCreated`, `leaveRequestSubmitted`, `leaveApproved`, `leaveRejected`, `transportRequestSubmitted`, `transportRequestApproved`, `transportRequestRejected`, etc.

Viewable at `/audit` (admin role only).

---

## Dashboard Architecture

Each role has its own dashboard page. The shared `(dashboard)/layout.tsx` provides:
- `Sidebar` — filtered nav links based on `activeRole`
- `Topbar` — search, notifications, dark-mode toggle, user menu
- `AIDrawer` — slides in from right on `useUIStore.toggleAiDrawer()`
- Route protection — redirects unauthenticated users to `/login`

Role → Dashboard route mapping:
```
admin   → /admin
vp*     → /vp
teacher → /teacher
parent  → /parent
student → /student-view
```

---

## Transport Architecture

**Read-mostly mock module.** No GPS integration.

Data sources (`src/lib/mockData/transport.ts`):
- `BUS_ROUTES[]` — 6 routes, single source of truth for route identity
- `VEHICLE_EXTRAS[]` — 6 vehicle records (driver, capacity, status, registration)
- `initialVehicles` — combined from the above, IDs `VH-01` to `VH-06`
- `initialTransportRequests` — 5 seed transport change requests

All transport data loaded into `useDataStore` on init. `transportRequests` supports CRUD (approve/reject).

Pages: `/transport`, `/transport/vehicles`, `/transport/routes`, `/transport/reports`

---

## AI Architecture

`/ai-insights` is a **visual demo — no ML model connected**.

- Risk alerts, trend numbers, and KPI strings come from `src/lib/mockData/admin.ts`
- "Take Action" buttons show a success toast only — no store mutations
- At-risk student list on admin dashboard IS semi-live: merges static admin list with live `students.filter(s => s.performanceTier === "at-risk")`
- True AI integration is pending (planned: NestJS + external ML service)

---

## Completed Audits

- **QA Audit** (Jun 2026): 22 routes × 7 roles. Found 1 Critical + 3 High + 10 Medium + 17 Low issues. Report at `plan/QA_AUDIT_REPORT.md`.

---

## Known Bugs

| ID | Severity | Description |
|----|----------|-------------|
| AD-04 | Medium | Settings page values not persisted across page refresh |
| PA-01 | Medium | Parent attendance log has hardcoded 2024 dates (not from live records) |
| AI-01 | Medium | AI Insights risk count is a static string, not derived from live `students` |
| AI-02 | Medium | AI Insights KPIs (attendance rate, fee %) are static mock strings |
| P-01 | Medium | `filterParentsForRole("teacher")` returns whole grade, not just teacher's section |
| AD-02 | Medium | Fee collection rate on admin dashboard is a static string |
| ST-01 | Low | `/ai-insights` briefly flashes admin UI before redirect for student role |
| VP-02 | Low | VP dashboard attendance chart uses static data |
| TC-02 | Low | Homework list on teacher dashboard is static |

---

## Workflow Gaps

- **Settings**: User changes are shown via toast but not saved to `useDataStore` — reset on refresh
- **AI Insights actions**: Buttons show success toasts but don't update any store state
- **File attachments**: Messages and Announcements show "demo mode" toast — no file handling
- **OTP**: Always accepts any code — no real verification flow
- **Fees payment**: No payment gateway — invoice status changes are not wired

---

## High Priority Fixes

In order of severity:

1. **AD-04** — Persist Settings to `useDataStore` (add `schoolSettings` state slice)
2. **PA-01** — Replace parent attendance hardcoded dates with `generateAttendanceRecords()` output
3. ~~**P-01**~~ — ✅ Fixed: `filterParentsForRole("teacher")` now filters by `childGrade === DEMO_TEACHER_GRADE && childSection === DEMO_TEACHER_SECTION`
4. **AI-01/AI-02** — Derive AI Insights stats from live `useDataStore.students` (count `performanceTier === "at-risk"`, compute attendance rate from `attendanceRecords`)
5. **AD-02** — Compute fee collection rate from live fee records instead of static string

---

## Recommended Next Development Order

1. Fix open medium-severity bugs (AD-04, PA-01, P-01, AI-01, AI-02, AD-02)
2. Wire Settings persistence (add `schoolSettings` to `useDataStore`)
3. Derive AI Insights KPIs from live store data
4. Add backend: PostgreSQL schema (see `plan/` directory for architecture docs), NestJS API
5. Replace Zustand mock store with TanStack Query + real API calls (store structure already matches)
6. Add real file upload (Messages + Announcements)
7. Add transport GPS map integration
8. Add real OTP via SMS/email
9. Multi-tenancy: school switching, tenant isolation

---

## Important Files

| File | Purpose |
|------|---------|
| `src/lib/mockData/credentials.ts` | All login accounts + PIN lookup function — single source of truth for auth |
| `src/lib/permissions.ts` | ALL role-based data filtering — never bypass this |
| `src/store/useDataStore.ts` | Master Zustand store — all mutable state + event log |
| `src/store/useAuthStore.ts` | Session management (login/logout/user state) |
| `src/store/usePinStore.ts` | PIN gate state + lockout logic |
| `src/lib/mockData/population.ts` | Student/teacher/parent/attendance data generators |
| `src/lib/mockData/transport.ts` | BUS_ROUTES + VEHICLE_EXTRAS (transport seed data) |
| `src/lib/mockData/admin.ts` | Admin KPI stats, activity timeline, at-risk list (mostly static) |
| `src/lib/systemHealth.ts` | Architecture validator (pure function, no hooks) |
| `src/lib/architectureRules.ts` | Formal rule contracts |
| `src/lib/devGuard.ts` | Runtime architecture checker |
| `src/components/common/PinGate.tsx` | PIN challenge overlay component |
| `src/components/common/Sidebar.tsx` | Role-filtered navigation |
| `src/app/(dashboard)/layout.tsx` | Protected layout wrapping all dashboard pages |
| `plan/QA_AUDIT_REPORT.md` | Full QA audit results (22 routes × 7 roles) |
| `docs/DEMO_CREDENTIALS.md` | All demo credentials (source-verified) |
| `docs/PROJECT_STATE.md` | Feature status, known issues, routes reference |
| `docs/AGENT_HANDOFF.md` | This file — agent onboarding guide |
| `.agents/memory/MEMORY.md` | Persistent agent memory index |

---

## Validation Record

The following was verified against source code on June 19, 2026:

| Check | Result |
|-------|--------|
| All 7 login credentials | ✅ Verified against `MOCK_CREDENTIALS` in `credentials.ts` |
| All 4 PINs (admin, vp1, vp2, vp3) | ✅ Verified via `pin` field in `MOCK_CREDENTIALS` |
| VP grade ranges | ✅ Verified: `vp1=[1,4]`, `vp2=[5,8]`, `vp3=[9,12]` in `permissions.ts` |
| DEMO_CHILD_ID | ✅ `"STU-0451"` in `permissions.ts` (NOT `STU-0001`) |
| DEMO_TEACHER_ID | ✅ `"TCH-003"` — pinned at index 2 in `getAllTeachers()` |
| DEMO_TEACHER_GRADE / SECTION | ✅ `10` / `"A"` in `permissions.ts` |
| All 6 transport routes | ✅ Verified against `BUS_ROUTES` array in `transport.ts` |
| All 6 vehicle records + drivers | ✅ Verified against `VEHICLE_EXTRAS` + `initialVehicles` in `transport.ts` |
| All conductors | ✅ Added — previously undocumented: Ahmed Al-Zahrani, Khalid Al-Dosari, Omar Al-Harbi, Bilal Al-Shehri, Nawaf Al-Sayed, Ziad Al-Farouk |
| No "Transport Manager" role | ✅ Confirmed — only 7 `AppRole` values exist in `useRoleStore.ts` |
| All 45 page routes | ✅ Verified via `find src/app/(dashboard) -name "page.tsx"` |
| `DEMO_CHILD_ID` mismatch in old docs | ✅ Corrected: was `STU-0001`, actually `STU-0451` |
