# Tanweer Master UI Architecture Design

## Executive Summary
This document provides the complete UI/UX architecture for the Tanweer School Management System, designed to be implementation-ready for frontend developers and designers.

## 1. Modular UI Design
- **Global Navigation & Layout:** [01_global_navigation.md](./01_global_navigation.md)
- **Dashboard & Communication:** [02_dashboard_communication.md](./02_dashboard_communication.md)
- **Admissions & Students:** [03_admissions_students.md](./03_admissions_students.md)
- **Parents & Teachers:** [04_parents_teachers.md](./04_parents_teachers.md)
- **Attendance & Timetable:** [05_attendance_timetable.md](./05_attendance_timetable.md)
- **Exams & Fees:** [06_exams_fees.md](./06_exams_fees.md)
- **Reports & AI Assistant:** [07_reports_ai.md](./07_reports_ai.md)

## 2. User Experience Strategy
- **Role-Based Views:** Tailored experiences for 7 distinct roles.
- **Key User Flows:** Critical paths for Enrollment, Attendance, Fees, and AI generation.
- **Details:** [08_roles_flows.md](./08_roles_flows.md)

## 3. Low-Fidelity Wireframes (Textual)

### Primary App Shell
```text
+-------------------------------------------------------------+
| [School Name]    [Search Students...]    [Year]  [🔔] [👤] |
+------------------+------------------------------------------+
|                  |                                          |
| Dashboard        | Breadcrumbs: Home / Dashboard            |
|                  |                                          |
| Admissions       | +-------------------------------------+  |
| Students         | |                                     |  |
| Academics  [v]   | |        MAIN CONTENT AREA            |  |
| Finance    [v]   | |                                     |  |
| HR         [v]   | |                                     |  |
| AI Insights      | |                                     |  |
|                  | |                                     |  |
| Settings         | +-------------------------------------+  |
|                  |                                          |
|                  |                                   [✨AI] |
+------------------+------------------------------------------+
```

### Student Profile (Tabbed View)
```text
+-------------------------------------------------------------+
| Header: [Photo] John Doe | Grade 10-A | [Status: Active]    |
+-------------------------------------------------------------+
| [Personal] [Family] [Academic] [Attendance] [Fees] [Docs]   |
+-------------------------------------------------------------+
|                                                             |
|  + Personal Information                                     |
|  - Date of Birth: 12 Jan 2010                               |
|  - Blood Group: O+                                          |
|  - Address: 123 Main St, Springfield                        |
|                                                             |
|  + Family Mapping                                           |
|  - Father: Robert Doe (Emergency Contact)                   |
|  - Mother: Jane Doe                                         |
|                                                             |
+-------------------------------------------------------------+
```

### AI Chat Drawer (Expanded)
```text
+--------------------------+
| ✨ Tanweer AI Assistant  |
+--------------------------+
| Today's Insights:        |
| - 3 Students at Risk     |
| - Fee collection 85%     |
|                          |
| ------------------------ |
| [User]: Show Grade 5     |
| attendance today.        |
|                          |
| [AI]: Grade 5 Attendance |
| Total: 50                |
| Present: 48 (96%)        |
| Absent: 2                |
|                          |
+--------------------------+
| [ Ask anything...     ]  |
+--------------------------+
```

## 4. Frontend Implementation Recommendations
- **Framework:** Next.js (App Router).
- **UI Components:** Shadcn/UI (Radix UI + Tailwind CSS).
- **Forms:** React Hook Form + Zod for validation.
- **Charts:** Recharts or Tremor for dashboard analytics.
- **Responsiveness:** Mobile-first approach with Tailwind breakpoints.
