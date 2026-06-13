# API Specification: Admissions, Students, and Parents

## 1. Admissions Module

### POST /api/v1/admissions/leads
Capture a new lead.
*   **Request Body:**
    ```json
    {
      "student_first_name": "Jane",
      "student_last_name": "Doe",
      "parent_email": "jane.p@example.com",
      "interest_class_id": "uuid"
    }
    ```
*   **Permission:** `admissions.lead_create`
*   **Response (201 Created):** `{ "id": "uuid", "status": "New" }`

### GET /api/v1/admissions/applications
List applications with filters.
*   **Permission:** `admissions.view`
*   **Filtering:** `filter[status]`, `filter[academic_year_id]`.
*   **Search:** Searches applicant name.

### POST /api/v1/admissions/applications/:id/enroll
Convert an approved application to a student.
*   **Permission:** `admissions.approve`
*   **Business Rules:** Application status must be "Approved". Creates User, Student, and Enrollment records.

---

## 2. Students Module

### GET /api/v1/students
List students.
*   **Permission:** `students.view`
*   **Filtering:** `filter[section_id]`, `filter[class_id]`, `filter[status]`.
*   **Search:** Searches name and admission_number.

### GET /api/v1/students/:id
Get full student profile.
*   **Permission:** `students.view`
*   **Response Example:**
    ```json
    {
      "id": "uuid",
      "admission_number": "2024001",
      "first_name": "John",
      "last_name": "Doe",
      "parents": [ { "id": "uuid", "relationship": "Father" } ]
    }
    ```

### PATCH /api/v1/students/:id
Update student details.
*   **Permission:** `students.edit`

---

## 3. Parents Module

### GET /api/v1/parents
Search and list parents.
*   **Permission:** `parents.view`

### POST /api/v1/parents/:id/students
Map a parent to a student.
*   **Request Body:** `{ "student_id": "uuid", "relationship": "Mother" }`
*   **Permission:** `parents.edit`
