# Tanweer PRD: Core Functional Requirements

## 1. User Management & Authentication

### User Stories
*   **As a User**, I want to log in securely with MFA so that my data is protected.
*   **As an Admin**, I want to manage roles and permissions so that users only access what they need.

### Acceptance Criteria
*   Support for Email/Password login + TOTP-based MFA.
*   Stateless session management using JWT.
*   RBAC enforced at both UI and API levels.

---

## 2. Admission Management

### User Stories
*   **As a Parent**, I want to apply for admission online so that I don't have to visit the school physically.
*   **As an Admissions Officer**, I want to track leads through a pipeline so that I can maximize conversions.

### Business Rules
*   Leads must be converted to Students only after fee payment and principal approval.
*   Application numbers must be unique and follow a configurable pattern.

### Acceptance Criteria
*   Kanban-style lead tracking board.
*   Online document upload (PDF/Images) with verification status.
*   Automated email/SMS notifications for status changes.

---

## 3. Student & Parent Management

### User Stories
*   **As a Teacher**, I want to view a student's full profile (including medical info) so that I can support them effectively.
*   **As an Admin**, I want to bulk-promote students to the next grade so that academic year transitions are easy.

### Business Rules
*   Every student must be mapped to at least one primary guardian.
*   Admission numbers are permanent and cannot be reused.

### Acceptance Criteria
*   Tabbed student profile view (Personal, Family, Academic, Health).
*   Sibling mapping support (One parent to multiple students).
*   Bulk promotion tool with section assignment.
