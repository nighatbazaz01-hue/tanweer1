# Tanweer PRD: Financial and Strategic Requirements

## 1. Fee Management

### User Stories
*   **As an Accountant**, I want to define fee heads and amounts so that I can generate student invoices.
*   **As a Parent**, I want to pay my child's fees online so that I can avoid visiting the school's bank.

### Business Rules
*   Fee discounts must be approved by the school admin.
*   Receipt numbers must be unique across the entire school.

### Acceptance Criteria
*   Configurable fee structure (Tuition, Transport, etc.) per class.
*   Integration with major payment gateways (Stripe, Razorpay).
*   Automatic calculation of late fees and fines.

---

## 2. AI Platform (AI-First Strategy)

### Features
*   **AI Insights:** Predicting students at academic risk and fee default alerts.
*   **AI Teacher Assistant:** Automated lesson planning and report card comment generation.
*   **AI Parent Assistant:** Conversational access to child's attendance, grades, and school policies.

### Acceptance Criteria
*   Context-aware AI responses based on user role and data permissions.
*   Vector search (RAG) for answering questions about school handbooks and policies.
*   User feedback loop (Thumbs up/down) to refine AI accuracy.

---

## 3. Reporting & Analytics

### User Stories
*   **As a Principal**, I want to see a daily dashboard of school health so that I can make data-driven decisions.
*   **As an Admin**, I want to export custom reports so that I can share them with educational ministries.

### Acceptance Criteria
*   High-level KPI cards (Total Students, Staff, Revenue).
*   Admission funnel visualizations.
*   Export reports in PDF and Excel formats.
*   Scheduled report delivery via email.
