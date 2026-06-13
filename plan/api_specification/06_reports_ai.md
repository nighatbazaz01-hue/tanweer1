# API Specification: Reports and AI Assistant

## 1. Reports Module

### GET /api/v1/reports/finance/summary
Get high-level financial KPIs.
*   **Permission:** `reports.view_finance`
*   **Filtering:** `filter[academic_year_id]`.

### GET /api/v1/reports/students/risk
List students predicted at academic or attendance risk.
*   **Permission:** `reports.view_general`
*   **Response (200 OK):**
    ```json
    {
      "data": [
        { "student_id": "uuid", "risk_type": "Attendance", "confidence": 0.85 }
      ]
    }
    ```

---

## 2. AI Assistant Module

### POST /api/v1/ai/chat
Interact with the AI Assistant.
*   **Request Body:**
    ```json
    {
      "conversation_id": "uuid-optional",
      "context_type": "Teacher Assistant",
      "message": "Give me a summary of attendance for Grade 10-A."
    }
    ```
*   **Permission:** `ai_assistant.use`
*   **Business Rules:** AI context is restricted based on user roles and school_id.

### POST /api/v1/ai/generate
Generate educational content.
*   **Request Body:**
    ```json
    {
      "type": "Lesson Plan",
      "params": { "subject": "Math", "topic": "Fractions", "grade": "5" }
    }
    ```
*   **Permission:** `ai_assistant.use`
*   **Response (200 OK):** `{ "generated_text": "Markdown content..." }`

### GET /api/v1/ai/insights
Retrieve AI-generated predictions and insights.
*   **Permission:** `ai_insights.view`
*   **Filtering:** `filter[category]` (e.g., "Fee Default").
