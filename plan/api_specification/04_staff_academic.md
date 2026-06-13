# API Specification: Teachers, Attendance, and Timetable

## 1. Staff/Teachers Module

### GET /api/v1/staff
List all school staff.
*   **Permission:** `staff.view`
*   **Filtering:** `filter[department]`, `filter[status]`.

### POST /api/v1/staff/:id/subjects
Assign a teacher to a subject.
*   **Request Body:** `{ "subject_id": "uuid", "section_id": "uuid" }`
*   **Permission:** `staff.edit`

---

## 2. Attendance Module

### POST /api/v1/attendance/bulk
Mark attendance for a group of students.
*   **Request Body:**
    ```json
    {
      "date": "2024-05-20",
      "section_id": "uuid",
      "subject_id": "uuid", // Optional
      "records": [
        { "user_id": "uuid", "status": "Present" },
        { "user_id": "uuid", "status": "Absent", "remarks": "Sick leave" }
      ]
    }
    ```
*   **Permission:** `attendance.mark`
*   **Business Rules:** Cannot mark attendance for future dates. Triggers push notifications for absences.

### GET /api/v1/attendance/stats
Get attendance analytics.
*   **Permission:** `attendance.view_analytics`
*   **Filtering:** `filter[start_date]`, `filter[end_date]`, `filter[class_id]`.

---

## 3. Timetable Module

### GET /api/v1/timetable/sections/:id
Get weekly timetable for a section.
*   **Permission:** `timetable.view`
*   **Response (200 OK):**
    ```json
    {
      "monday": [
        { "start_time": "08:00", "end_time": "09:00", "subject": "Math", "teacher": "Mr. Smith" }
      ]
    }
    ```

### POST /api/v1/timetable/entries
Create a new timetable entry.
*   **Permission:** `timetable.manage`
*   **Validation:** Conflict check (Teacher/Room) before saving.
