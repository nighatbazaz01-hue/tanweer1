---
name: Student Data Model
description: Canonical Student interface and generator in population.ts; expanded with Phase 6 fields
---

## Rule
The `Student` interface in `src/lib/mockData/population.ts` is the single canonical student shape. Never duplicate student fields in other files. Always access students via `useDataStore` → `getAllStudents()`.

## Interface fields (as of Phase 6 expansion)
Core: id, name, gender, grade, section, attendanceRate, performanceTier, gpa, parentName, parentPhone, parentEmail, avatar, enrolledYear

Phase 6 additions (all generated via seeded random for consistency):
- nationalId, bloodType, nationality, address, phone, email
- medicalNote? (15% of students have one)
- interests[] (2–4 items each)
- emergencyContact { name, phone, relation }
- previousSchool? (students grade > 1)

## Key facts
- 600 students total: 12 grades × 50 students × 4 sections (A–B–C–D)
- Demo student: Ahmed Al-Rashidi, STU-0451 (Grade 10-A) — parent/student login persona
- student360.ts is a separate static mock for the 360 detail page — it is NOT auto-generated from population.ts

**Why:** Expanding the Student interface is backward-compatible (new fields are optional or always present via generator). Adding fields to the interface requires updating the generator's `result.push({...})` block.
