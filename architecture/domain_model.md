# Tanweer Domain Model

## Core Domain Entities

### Organization
*   **School:** The top-level tenant.
*   **AcademicYear:** Time-based container for all academic activities.
*   **Campus:** Physical location of a school.
*   **Building/Room:** Infrastructure within a campus.
*   **Class:** Grade levels (e.g., Grade 1, Grade 2).
*   **Section:** Specific groups within a Class (e.g., Grade 1-A).
*   **Subject:** Academic disciplines (e.g., Mathematics, Physics).

### User Management
*   **User:** Base identity for all actors.
*   **Role/Permission:** RBAC system.
*   **Profile:** Extended information for users.

### Admissions
*   **Lead:** Potential student interest.
*   **Application:** Formal request for enrollment.
*   **AdmissionProcess:** Workflow stages for applications.

### Student & Parent Management
*   **Student:** Primary beneficiary of the platform.
*   **Parent/Guardian:** Legal representative and payer.
*   **StudentParentMapping:** Relationship between students and parents (supports multiple guardians).

### Academics
*   **Staff/Teacher:** Employees managing education and admin.
*   **Timetable:** Scheduling of subjects, teachers, and rooms.
*   **Attendance:** Record of presence for students and staff.
*   **Exam/Assessment:** Formal evaluation of student performance.
*   **Assignment/Homework:** Continuous learning tasks.

### Operations & Finance
*   **FeeStructure:** Definition of costs.
*   **FeePayment:** Transactional records of payments.
*   **Communication:** SMS/Email/Notifications sent to stakeholders.
*   **Inventory:** Physical assets of the school.
*   **Transport:** Logistics for student commute.
*   **Library:** Management of books and lending.

### AI Domain
*   **AIInsight:** Machine learning derived observations.
*   **AIConsultation:** Interactions with AI assistants.
*   **AIGeneratedContent:** Lesson plans, assignments, or comments created by AI.

## Domain Diagram (Mermaid)

```mermaid
erDiagram
    SCHOOL ||--o{ CAMPUS : "has"
    SCHOOL ||--o{ ACADEMIC_YEAR : "manages"
    CAMPUS ||--o{ BUILDING : "contains"
    BUILDING ||--o{ ROOM : "contains"
    SCHOOL ||--o{ CLASS : "defines"
    CLASS ||--o{ SECTION : "divided into"
    SECTION ||--o{ STUDENT_SECTION_ENROLLMENT : "has"
    
    USER ||--o{ ROLE : "assigned"
    USER ||--o{ USER_PROFILE : "has"
    
    STUDENT ||--o{ STUDENT_PARENT_MAPPING : "has"
    PARENT ||--o{ STUDENT_PARENT_MAPPING : "manages"
    
    TEACHER ||--o{ SUBJECT_ASSIGNMENT : "teaches"
    SUBJECT ||--o{ SUBJECT_ASSIGNMENT : "is taught"
    
    SECTION ||--o{ TIMETABLE_ENTRY : "follows"
    TEACHER ||--o{ TIMETABLE_ENTRY : "executes"
    ROOM ||--o{ TIMETABLE_ENTRY : "hosts"
    
    STUDENT ||--o{ ATTENDANCE : "marked"
    STUDENT ||--o{ EXAM_RESULT : "achieves"
    STUDENT ||--o{ ASSIGNMENT_SUBMISSION : "submits"
    
    SCHOOL ||--o{ FEE_STRUCTURE : "defines"
    STUDENT ||--o{ FEE_PAYMENT : "makes"
    
    SCHOOL ||--o{ AI_INSIGHT : "receives"
    USER ||--o{ AI_CONVERSATION : "interacts"
```
