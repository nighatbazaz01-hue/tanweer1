# UI Architecture: Admissions and Students

## 1. Admissions Module

### Screens
*   **Leads Pipeline:** Kanban board view of prospective students (New -> Contacted -> Interaction -> Assessment).
*   **Application Detail:** Full view of student/parent data, document uploads, and processing history.
*   **Scheduling Tool:** Calendar view for student interactions and entrance assessments.
*   **Admissions Dashboard:** Conversion funnel visualization.

### User Actions
*   Drag-and-drop leads between statuses.
*   Upload/Verify documents.
*   Record assessment results.
*   Convert approved application to enrollment (creates Student record).

### Required Permissions
*   `admissions.view`
*   `admissions.edit`
*   `admissions.approve`

### APIs Consumed
*   `GET /admissions/leads`
*   `PATCH /admissions/applications/:id/status`
*   `POST /admissions/enroll`

### Validation Rules
*   Mandatory fields for enrollment: Class, Section, Admission Number.
*   Document verification required before final approval.

---

## 2. Students Module

### Screens
*   **Student Directory:** Searchable list with filters (Class, Section, Status).
*   **Student Profile:** Tabbed view (Personal, Family, Academic History, Documents, Attendance).
*   **Promotions:** Bulk interface to move students to the next grade.
*   **Withdrawal Process:** Form to handle student departures and TC generation.

### User Actions
*   Search for student by name or admission number.
*   Update medical or contact info.
*   Assign student to a house.
*   Download ID cards / Certificates.

### Required Permissions
*   `students.view`
*   `students.edit`
*   `students.promote`

### Data Displayed
*   Admission #, Name, Class, Roll #, Parent Name, Phone, Blood Group, Profile Photo.

### Validation Rules
*   Unique Admission Number.
*   Email/Phone format validation for parent contacts.
*   Birth date cannot be in the future.
