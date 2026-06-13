# Seeding and Environment Data Strategy

## 1. Seeding Strategy
Seeding is divided into three categories based on the environment and purpose.

### Category A: System Seed (Static Data)
Required for the application to function. Applied to all environments.
*   **Examples:** Permissions, Default Roles, Country/Currency codes, Grade Scales (Standard).
*   **Tooling:** JSON-based seed files versioned in Git.

### Category B: Development Seed (Fake Data)
Used by developers to build and test features.
*   **Examples:** 50 Students, 10 Teachers, 2 Campuses with generated attendance/fees.
*   **Tooling:** `Faker.js` or equivalent for realistic but fake PII.
*   **Automation:** Script `npm run db:seed:dev`.

### Category C: Demo Seed (Sanitized Production-like Data)
Used for sales demos and QA staging.
*   **Examples:** "Tanweer Demo Academy" with a complete academic year, full timetables, and diverse fee statuses.
*   **Requirement:** High-quality, consistent data that showcases all modules (AI Insights, Kanban board, etc.).

---

## 2. Environment Data Strategy

| Environment | Data Source | PII Protection |
| :--- | :--- | :--- |
| **Local** | System Seed + Dev Seed | Synthetic only. |
| **Staging** | Production Clone (Monthly) | **Mandatory Anonymization** of student names, parent emails, and staff salaries. |
| **Production** | Live Tenant Data | Full encryption and RLS enforcement. |
| **Demo** | Demo Seed | Fixed synthetic dataset. |

### Anonymization Business Rules:
1.  **Emails:** Replace with `tenant_id+hash@tanweer.demo`.
2.  **Phone Numbers:** Replace with random numbers in school's region.
3.  **Addresses:** Shift coordinates or randomize street names.
4.  **Passwords:** Set all non-admin passwords to a known development hash.

---

## 3. Seed Datasets for Demo Environment
*   **School:** "Horizon International" (UUID-1).
*   **Students:** 200 Students across 3 Grade levels (8, 9, 10).
*   **Staff:** 15 Teachers, 2 Accountants, 1 Principal.
*   **Scenarios:**
    *   3 Students with "Academic Risk" insights.
    *   5 Students with "Overdue Fees".
    *   A fully populated timetable for the current week.
