# Tanweer Master Development Roadmap

## Executive Summary
This document provides the 12-week development plan for the Tanweer School Management System MVP. The plan is divided into 6 two-week sprints, executed by a team of 4 (2 Full Stack Developers, 1 Frontend Developer, 1 QA Engineer).

## 1. Team Composition
*   **Developer 1 (Full Stack):** Backend Lead, DB/RLS Architecture, Auth, AI Integration.
*   **Developer 2 (Full Stack):** Backend Features (Fees, Exams, Academics), API Design.
*   **Developer 3 (Frontend):** UI/UX Lead, Components, State Management, Dashboard.
*   **QA Engineer:** Testing Strategy, Bug tracking, E2E Testing, AI Verification.

## 2. Sprint Schedule

| Sprint | Weeks | Primary Focus | Documentation |
| :--- | :--- | :--- | :--- |
| **Sprint 1** | 1-2 | Foundation & Core Organization | [01_sprint_1.md](./01_sprint_1.md) |
| **Sprint 2** | 3-4 | Student Lifecycle & Admissions | [02_sprint_2.md](./02_sprint_2.md) |
| **Sprint 3** | 5-6 | Academic Management & Attendance | [03_sprint_3.md](./03_sprint_3.md) |
| **Sprint 4** | 7-8 | Financial & Fee Management | [04_sprint_4.md](./04_sprint_4.md) |
| **Sprint 5** | 9-10 | Exams, Communication & AI MVP | [05_sprint_5.md](./05_sprint_5.md) |
| **Sprint 6** | 11-12 | Stabilization, Reports & Release | [06_sprint_6.md](./06_sprint_6.md) |

## 3. High-Level Delivery Milestones

*   **End of Week 2:** Platform infrastructure and Multi-tenancy live on dev environment.
*   **End of Week 4:** First student enrollment successfully processed.
*   **End of Week 6:** Timetables and Attendance functional for test classes.
*   **End of Week 8:** Online fee payment processing integrated.
*   **End of Week 10:** AI Assistant operational for internal testing.
*   **End of Week 12:** Production MVP Release.

## 4. Operational Recommendations
*   **Daily Standups:** 15-min sync at 9:00 AM.
*   **Code Reviews:** Mandatory for all PRs; focus on RLS security and Type safety.
*   **QA Integration:** QA starts testing features as soon as they are "Ready for QA" in the sprint board.
*   **Documentation:** Maintain OpenAPI (Swagger) documentation automatically from NestJS.
