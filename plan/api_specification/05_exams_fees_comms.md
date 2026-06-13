# API Specification: Exams, Fees, and Communication

## 1. Examination Module

### POST /api/v1/exams/plans
Create a new exam plan (e.g., Mid-Term).
*   **Permission:** `exams.manage`

### POST /api/v1/exams/results/bulk
Upload marks for a group of students.
*   **Request Body:**
    ```json
    {
      "exam_subject_id": "uuid",
      "results": [
        { "student_id": "uuid", "marks_obtained": 85.5, "remarks": "Good" }
      ]
    }
    ```
*   **Permission:** `marks.entry`
*   **Validation:** Marks obtained cannot exceed max marks for the subject.

---

## 2. Fee Management Module

### GET /api/v1/fees/structures
List fee heads and amounts.
*   **Permission:** `fees.manage_structure`

### POST /api/v1/fees/payments
Record a new fee payment.
*   **Request Body:**
    ```json
    {
      "student_id": "uuid",
      "amount_paid": 500.00,
      "payment_method": "Cash",
      "transaction_id": "string"
    }
    ```
*   **Permission:** `fees.collect`
*   **Response (201 Created):** `{ "id": "uuid", "receipt_number": "REC-001" }`

### GET /api/v1/fees/invoices/:id
Get invoice/due details for a student.
*   **Permission:** `fees.view_personal`

---

## 3. Communication Module

### POST /api/v1/communications/send
Send a new message/announcement.
*   **Request Body:**
    ```json
    {
      "type": "SMS",
      "recipient_type": "Class",
      "class_id": "uuid",
      "subject": "School Holiday",
      "content": "Tomorrow is a holiday."
    }
    ```
*   **Permission:** `communication.send`
*   **Business Rules:** Deducts SMS credits if applicable.

### GET /api/v1/communications
List sent communications.
*   **Permission:** `communication.view_all`
