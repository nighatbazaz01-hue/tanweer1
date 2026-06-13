# Tanweer Role-Specific Experiences and User Flows

## 1. Role-Specific Experiences

### Super Admin (Platform Owner)
*   **Focus:** Global health, billing, and system updates.
*   **Unique UI:** Multi-school dashboard, System logs, Global configuration.

### School Admin / Principal
*   **Focus:** Decision making, staff performance, and financial oversight.
*   **Unique UI:** High-level KPIs, Admission funnel, Critical alerts (e.g. major absenteeism).

### Teacher
*   **Focus:** Productivity and student engagement.
*   **Unique UI:** "My Day" view, Rapid attendance marker, Mark entry sheet, AI Lesson generator.

### Parent
*   **Focus:** Child's progress and logistics.
*   **Unique UI:** Child switcher (for multiple kids), Attendance calendar, Fee payment portal, Push notifications for bus arrival.

### Student
*   **Focus:** Learning and schedules.
*   **Unique UI:** Assignment submission portal, Personal timetable, Exam results, Library catalog.

### Accountant
*   **Focus:** Financial accuracy and collections.
*   **Unique UI:** Fee counter interface, Bank reconciliation tools, Late fee reports.

---

## 2. Key User Flows

### Flow A: Student Enrollment (Admin)
1.  **Start:** Navigate to Admissions -> Approved Applications.
2.  **Action:** Select Application and click "Enroll".
3.  **Input:** Assign Admission Number, Class, and Section.
4.  **System:** Creates User, Student record, and StudentEnrollment.
5.  **Output:** Success message and option to "Print ID Card".

### Flow B: Mark Attendance (Teacher)
1.  **Start:** Mobile or Desktop Dashboard -> "Mark Attendance".
2.  **System:** Defaults to Teacher's assigned class for today.
3.  **Action:** Toggle "Absent" for students not present.
4.  **Action:** Add remarks for specific students if needed.
5.  **Finish:** Click "Submit".
6.  **System:** Sends Push/SMS to parents of absent students.

### Flow C: Pay Fees (Parent)
1.  **Start:** Dashboard -> Fees Widget -> "View Invoices".
2.  **Action:** Select pending invoice and click "Pay Now".
3.  **Action:** Enter payment details on gateway.
4.  **System:** Records FeePayment and updates invoice status.
5.  **Output:** Automatic generation and download of Receipt.

### Flow D: AI Lesson Planning (Teacher)
1.  **Start:** AI Assistant -> "Lesson Plan Generator".
2.  **Input:** Subject, Topic, Grade, and Learning Objectives.
3.  **System:** Generates structured lesson plan including activities and homework.
4.  **Action:** Teacher edits/refines the plan.
5.  **Finish:** Save to "My Lessons" or "Export to PDF".
