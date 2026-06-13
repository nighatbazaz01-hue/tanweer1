# UI Architecture: Parents and Teachers

## 1. Parents Module

### Screens
*   **Parent Directory:** List of registered parents with child mappings.
*   **Parent Profile:** View/Edit contact info, communication preferences, and children list.
*   **Family Tree View:** Visual representation of student-parent-sibling relationships.

### User Actions
*   Map a parent to multiple students (siblings).
*   Toggle "Emergency Contact" or "Has Custody" flags.
*   Update phone/email.

### Required Permissions
*   `parents.view`
*   `parents.edit`

### APIs Consumed
*   `GET /parents`
*   `POST /parents/mapping`

---

## 2. Teachers (Staff) Module

### Screens
*   **Staff Directory:** All employees (Teaching & Non-teaching).
*   **Staff Profile:** Personal, Qualifications, Experience, Documents, Payroll.
*   **Subject Assignment:** Matrix to assign teachers to subjects/sections.
*   **Leave Management:** Staff leave request portal and Admin approval dashboard.

### User Actions
*   Assign a Class Teacher to a section.
*   Upload certifications.
*   Approve/Reject leave applications.
*   Download salary slips.

### Required Permissions
*   `staff.view`
*   `staff.edit`
*   `leave.approve`

### Data Displayed
*   Employee ID, Name, Designation, Department, Subjects taught, Leave balance.

### Validation Rules
*   Employee ID must be unique.
*   Leave dates cannot overlap for the same user.
*   Salary amount must be positive.
