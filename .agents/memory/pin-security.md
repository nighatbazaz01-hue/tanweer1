---
name: PIN Security System
description: Session-level secondary authentication for sensitive data fields; Admin/VP roles only
---

## Rule
All sensitive student/parent contact fields (phone, email, address) must be wrapped in `<PinGate>` for admin/VP roles. Teachers see "Contact administration", students/parents see "Restricted".

## Implementation
- Store: `src/store/usePinStore.ts` — session-level unlock (not persisted), failCount, accessLog
- Component: `src/components/common/PinGate.tsx` — 4-digit PIN modal, 3-failure → security alert notification
- PINs: stored in `src/lib/mockData/credentials.ts`, retrieved via `getPinForRole(appRole)`
- Applied: `students/page.tsx` (profile dialog), `students/[id]/page.tsx` (contact row)

## PINs (demo)
- admin: 1234 | vp1: 5678 | vp2: 9012 | vp3: 3456
- Teacher/Student/Parent: no PIN — they get role-appropriate restriction message

**Why:** School board demo requires visible secondary security for GDPR/privacy compliance demonstration.

**How to apply:** `<PinGate correctPin={getPinForRole(activeRole)} role={activeRole} actor={user?.name} field="Field Name" inline>`
After 3 failures, `addNotification` is called with `roles: ["admin"]` — no circular dependency because component calls store directly.
