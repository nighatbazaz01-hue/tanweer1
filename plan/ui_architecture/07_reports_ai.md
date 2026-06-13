# UI Architecture: Reports and AI Assistant

## 1. Reports Module

### Screens
*   **Report Center:** Central hub categorized by module (Finance, Academics, Staff).
*   **Custom Report Builder:** Interface to select columns, apply filters, and choose export format (PDF/Excel).
*   **Scheduled Reports:** Manage automated delivery of reports via email.

### User Actions
*   Filter report data by date range, class, or status.
*   Toggle chart types (Bar, Line, Pie) for visual reports.
*   Save report templates for future use.

### Required Permissions
*   `reports.view_general`
*   `reports.view_finance`
*   `reports.export`

### Data Displayed
*   Tabular data, Data visualizations, Total counts/sums.

---

## 2. AI Assistant Module

### Purpose
Provide conversational access to platform data and automate content generation for stakeholders.

### Screens
*   **AI Chat Drawer:** Right-side overlay accessible from any screen for quick queries.
*   **AI Generation Workspace:** Dedicated full-screen interface for teachers/principals to generate long-form content (Lesson plans, circulars).
*   **AI Insights Dashboard:** Visual presentation of predictive alerts (Academic risk, Fee default prediction).

### User Actions
*   Ask conversational questions ("What is the attendance for Grade 10A today?").
*   Provide parameters for generation ("Generate a Math worksheet for 5th grade covering fractions").
*   Accept/Refine/Edit AI generated content.
*   Give feedback (Thumbs up/down) on AI responses.

### Required Permissions
*   `ai_assistant.use`
*   `ai_insights.view`

### APIs Consumed
*   `POST /ai/chat` (Conversational interface)
*   `POST /ai/generate` (Content generation)
*   `GET /ai/predictions`

### Data Displayed
*   Chat history, Suggested questions, Generated text/HTML, Prediction scores.

### Validation Rules
*   Limit daily message count based on school subscription tier.
*   PII protection: Ensure AI does not output sensitive personal data to unauthorized roles.
