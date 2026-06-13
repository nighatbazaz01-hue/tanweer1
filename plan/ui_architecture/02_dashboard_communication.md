# UI Architecture: Dashboard and Communication

## 1. Dashboard Module

### Purpose
Provide a high-level overview of key metrics, tasks, and alerts tailored to the logged-in user's role.

### Screens
*   **Principal Dashboard:** KPIs (Total Students, Staff, Fees collected), Admissions trends, Attendance alerts.
*   **Teacher Dashboard:** Today's timetable, pending assignments to grade, attendance status of home class.
*   **Student/Parent Dashboard:** Upcoming exams, homework due, fee payment status, school notices.

### User Actions
*   Switch academic year view.
*   Click through KPI cards to detailed reports.
*   View/Dismiss alerts.
*   Quick-link to mark attendance (Teacher).

### Required Permissions
*   `dashboard.view`
*   `analytics.view_kpis`

### APIs Consumed
*   `GET /analytics/kpis`
*   `GET /notifications/alerts`
*   `GET /timetable/today`

---

## 2. Communication Module

### Purpose
Centralize all school-to-home and internal communications.

### Screens
*   **Communication Center:** List of sent/received messages, filter by type (SMS, Email, Push).
*   **New Message:** Compose interface with recipient targeting (Class, Section, Individual).
*   **Circulars & Announcements:** Board-style view of official school notices.

### User Actions
*   Compose and send messages.
*   Attach documents to circulars.
*   Track message delivery/read status.
*   Schedule messages for later.

### Required Permissions
*   `communication.send`
*   `communication.view_all`
*   `circulars.manage`

### Data Displayed
*   Recipient list, Message body, Timestamp, Status (Sent/Delivered/Failed).
*   Circular title, File attachment preview.

### Validation Rules
*   Recipient must be selected before sending.
*   Message body cannot be empty.
*   SMS character limit warnings.
