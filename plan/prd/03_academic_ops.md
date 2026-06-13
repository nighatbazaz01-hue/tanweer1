# Tanweer PRD: Academic and Operational Requirements

## 1. Academics & Timetable

### User Stories
*   **As a Principal**, I want to build a school-wide timetable so that resources (rooms/teachers) are optimized.
*   **As a Teacher**, I want to see my daily schedule so that I can prepare for my classes.

### Business Rules
*   A teacher cannot be assigned to two overlapping periods.
*   A room cannot be assigned to two overlapping sections.

### Acceptance Criteria
*   Drag-and-drop timetable builder.
*   Real-time conflict detection and prevention.
*   Subject-specific period limits (e.g., Math max 5 periods/week).

---

## 2. Attendance Management

### User Stories
*   **As a Teacher**, I want to mark student attendance quickly so that I don't waste class time.
*   **As a Parent**, I want to be notified if my child is absent so that I can ensure their safety.

### Business Rules
*   Attendance cannot be modified for dates in the future.
*   Bulk marking (all present) must be supported to speed up the process.

### Acceptance Criteria
*   Class-wise and subject-wise attendance marking.
*   Automated push/SMS alerts to parents of absent students.
*   Attendance calendar view for students/parents.

---

## 3. Examination & Grading

### User Stories
*   **As a Teacher**, I want to enter marks for my students so that I can evaluate their progress.
*   **As a Principal**, I want to generate and distribute report cards digitally so that I can save on printing costs.

### Business Rules
*   Marks obtained cannot exceed the maximum marks defined for the subject.
*   Report cards can only be published after principal approval.

### Acceptance Criteria
*   Grade configuration based on percentage or rubrics.
*   Bulk mark entry using spreadsheets.
*   Customizable report card templates with auto-calculated GPA.
