---
name: System Health Dashboard
description: Developer validation page and utility; validates permissions, data sources, event system, role isolation
---

## Files
- `src/lib/systemHealth.ts` — pure function, no hooks; call `runSystemHealthCheck(storeSnapshot)` to get SystemHealthReport
- `src/app/(dashboard)/system-health/page.tsx` — dev-only dashboard; not in sidebar, direct URL /system-health

## What It Validates
- Legacy import status (all pages migrated from mockData.ts)
- Permission engine coverage (all 11 data pages verified)
- Hardcoded data warnings (academics curriculum arrays, role-home static files)
- Event system integrity (11 event types, schema validation, eventLog count)
- Data source integrity (population counts, store entity counts)
- Role isolation tests (parent=1 student, student=1 attendance, teacher=Grade10-A, VP grade ranges, admin=all 600)

## Known Warnings (not bugs)
- HD-001: academics/page.tsx has hardcoded subjects[] and upcomingExams[] (no curriculum module yet)
- HD-002: academics/page.tsx uses getAllTeachers().length (total count, not role-scoped) for stat card
- HD-003: Role home pages (admin, teacher, parent, student-view) use domain-specific static files — intentional

## Re-running
Click "Re-run Checks" button on the page. The check re-executes on every `store.eventLog.length` change automatically.

## Why
Ensures that as new features are added, the permission engine and event system remain consistent and no pages bypass the data access layer.
