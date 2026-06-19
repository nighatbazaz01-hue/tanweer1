---
name: Grade Records Store
description: How teacher grade entry flows to parent and student marks pages via useDataStore.gradeRecords
---

## Rule
`gradeRecords: GradeRecord[]` is the live marks state in `useDataStore`. Teacher writes via `bulkSetGradeRecords`; parent and student pages overlay store records on static `subjectMarks` by subject name.

**Why:** `subjectMarks` in `student.ts` is static and can't reflect teacher grade-entry changes. Adding a `gradeRecords` slice allows teacher → parent → student live marks without a backend.

## How to apply
- **Teacher** (`/teacher/performance`): `bulkSetGradeRecords(subject, studentGrades[], teacher, actor)` — call on save. Ahmed Al-Rashidi maps to `DEMO_CHILD_ID`; other students get `CLASS-<id>` prefix.
- **Parent** (`/parent/marks`) & **Student** (`/student-view/marks`): filter `gradeRecords` by `studentId === DEMO_CHILD_ID`, then for each entry in `staticSubjectMarks`, check for a live store record and override marks/grade/change if found. Show "live" / "updated" badge when `isLive === true`.
- Seed: `gradeRecords` is seeded at store init from `subjectMarks` for `DEMO_CHILD_ID`, so pages always have data even before teacher acts.
- `bulkSetGradeRecords` upserts by `studentId + subject` and computes grade letter + change delta from previous value automatically.
- Do NOT add `filterGradesForRole` to `permissions.ts` — would create a circular import (`useDataStore` already imports from `permissions.ts`). Filter inline in pages using `DEMO_CHILD_ID`.
