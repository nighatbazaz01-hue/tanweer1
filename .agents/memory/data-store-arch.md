---
name: Data Store Architecture
description: useDataStore is the single source of truth; event log system for all mutations
---

## Location
`src/store/useDataStore.ts`

## What the Store Holds
- `threads` — messages/conversations (from mockThreads)
- `announcements` — school announcements (from initialAnnouncements)
- `meetings` — calendar meetings (from initialMeetings)
- `tasks` — task management (from initialTasks)
- `notifications` — bell notifications (from allNotifications)
- `admissionLeads` — admission pipeline (from mockAdmissionLeads)
- `eventLog: AppEvent[]` — last 100 events emitted by all actions

## Event System
Every action emits a structured AppEvent via `makeEvent(type, actor, payload)`.
Event is prepended to `eventLog` and capped at 100 entries.

```typescript
interface AppEvent {
  id: string;       // EVT-{counter}
  type: AppEventType;
  timestamp: string; // ISO
  actor: string;
  payload: Record<string, unknown>;
}
```

Event types: messageCreated, replyAdded, threadStarred, meetingCreated, rsvpUpdated, announcementCreated, taskCreated, taskUpdated, attendanceUpdated, leadStatusUpdated, notificationRead, allNotificationsRead

## Key Rule
When `activeRole` changes in pages that use local state `[records, setRecords]` initialized from filtered data (attendance, fees), use `useEffect(() => { setRecords(baseRecords); setPage(1); }, [baseRecords])` to re-sync. Do NOT remove the local state — it's needed for in-page mutations (mark payment, edit attendance).

## Legacy File
`src/lib/mockData.ts` still exists and exports mockAdmissionLeads (used only by useDataStore for initialization). No page should import from the legacy file directly anymore.

## Why
Centralizing all mutations in one store with event emission makes the system auditable and ensures no silent state divergence between views.
