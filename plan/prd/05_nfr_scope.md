# Tanweer PRD: NFRs, Security, and Scope

## 1. Non-Functional Requirements (NFRs)
*   **Performance:** All core dashboard pages must load in < 2 seconds.
*   **Scalability:** The system must handle 10x growth in tenants without architecture changes.
*   **Availability:** 99.9% uptime SLA for the production environment.
*   **Usability:** Mobile-first responsive design for parents and students.

## 2. Security Requirements
*   **Multi-tenancy:** Strict data isolation via PostgreSQL RLS.
*   **Authentication:** Mandatory MFA for all administrative roles.
*   **Encryption:** Data encrypted at rest (AES-256) and in transit (TLS 1.3).
*   **Audit:** Detailed change logs for all financial and student records.

## 3. MVP Scope (12-Week Target)
*   Foundation (Auth, Schools, Users).
*   Admission Management (Leads, Applications, Enrollment).
*   Academic Core (Classes, Staff, Attendance).
*   Finance MVP (Fee structure, Offline collection).
*   AI Assistant MVP (Basic Q&A).

## 4. Future Scope (Post-MVP)
*   **AI Integration:** Advanced predictive analytics and full RAG knowledge base.
*   **Transport Management:** Live bus tracking and route optimization.
*   **Library Management:** Full digital catalog and RFID integration.
*   **Inventory Management:** Asset tracking and vendor procurement.
*   **Mobile Apps:** Native iOS/Android apps for Parents and Teachers.
