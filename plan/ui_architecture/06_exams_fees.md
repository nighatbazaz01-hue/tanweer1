# UI Architecture: Exams and Fees

## 1. Exams Module

### Screens
*   **Exam Planner:** Define exam name, dates, and applicable classes.
*   **Mark Entry Sheet:** Spreadsheet-like view for teachers to input marks for a subject/section.
*   **Grade Configuration:** Setup grade scales (A, B, C) and rubrics.
*   **Report Card Generator:** Visual preview and bulk export of student reports.

### User Actions
*   Publish exam schedule to parents.
*   Bulk import marks via Excel/CSV.
*   Apply "Grace Marks" to specific students.
*   Add descriptive teacher comments for report cards.

### Required Permissions
*   `exams.manage`
*   `marks.entry`
*   `reports.generate`

### APIs Consumed
*   `GET /exams/plans`
*   `POST /exams/results/bulk`
*   `GET /exams/report-cards/:id`

### Validation Rules
*   Marks entered cannot exceed Max Marks defined for the subject.
*   Negative marks not allowed (unless specified in config).

---

## 2. Fees Module

### Screens
*   **Fee Structure Setup:** Define fee heads (Tuition, Transport, Lab) and amounts.
*   **Fee Collection (Counter):** Search student -> View due -> Record payment (Cash/Cheque/POS).
*   **Online Payment Portal (Parent):** View invoices and pay via credit card/bank transfer.
*   **Due/Default List:** Report of students with outstanding balances.

### User Actions
*   Create custom discount/scholarship for a student.
*   Generate and print receipts.
*   Send automated SMS reminders for late fees.
*   Process refunds.

### Required Permissions
*   `fees.manage_structure`
*   `fees.collect`
*   `fees.view_personal` (Parent/Student)

### Data Displayed
*   Total Due, Amount Paid, Balance, Payment History, Fine Amount, Receipt #.

### Validation Rules
*   Receipt number must be unique.
*   Partial payments allowed but must update balance correctly.
*   Late fee calculation based on configurable grace period.
