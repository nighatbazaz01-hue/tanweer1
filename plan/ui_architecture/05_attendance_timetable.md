# UI Architecture: Attendance and Timetable

## 1. Attendance Module

### Screens
*   **Daily Attendance (Class View):** List of students in a section with Presence/Absence toggles.
*   **Subject-wise Attendance:** Interface for teachers to mark attendance for a specific period.
*   **Attendance Summary:** Calendar view for students/parents showing monthly status.
*   **Attendance Analytics:** Dashboard showing absenteeism trends and "At-risk" students.

### User Actions
*   Mark bulk presence (Default all to "Present").
*   Record late arrival time.
*   Input reason for absence.
*   Submit attendance (triggers notification to parents).

### Required Permissions
*   `attendance.mark`
*   `attendance.view`
*   `attendance.view_analytics`

### APIs Consumed
*   `GET /sections/:id/students`
*   `POST /attendance/bulk`
*   `GET /attendance/stats`

### Data Displayed
*   Student Name, Roll #, Profile Thumb, Presence Status (P/A/L/H), Remarks.

---

## 2. Timetable Module

### Screens
*   **Class Timetable:** Weekly grid view (Mon-Fri/Sat) showing subjects and teachers for a section.
*   **Teacher Schedule:** Personal grid view for teachers showing their periods and rooms.
*   **Room Availability:** View to check which rooms are free at any given period.
*   **Timetable Builder:** Admin tool to drag-and-drop subjects into periods.

### User Actions
*   Drag-and-drop assignment of teachers to periods.
*   Swap periods between teachers.
*   Filter timetable by Class/Teacher/Room.
*   Export timetable as PDF.

### Required Permissions
*   `timetable.manage`
*   `timetable.view`

### Data Displayed
*   Subject Name, Teacher Name, Room Number, Start/End Time.

### Validation Rules
*   Teacher Conflict: Same teacher cannot be in two places at once.
*   Room Conflict: Same room cannot host two classes simultaneously.
*   Subject Limit: Maximum periods for a subject per week.
