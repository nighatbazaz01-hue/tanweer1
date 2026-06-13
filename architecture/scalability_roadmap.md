# Scalability and Microservices Roadmap

## 1. Evolution from Modular Monolith to Microservices
Tanweer will start as a **Modular Monolith**. This allows for faster initial development and easier refactoring while the domain model is still being proven in production.

### Proposed Microservice Boundaries (Phase 2)
When certain modules face high load or require independent scaling, they will be extracted:

1.  **Identity Service:** Handles authentication, MFA, and RBAC across all schools. (Shared across all services).
2.  **Academic Service:** Core logic for Students, Classes, Timetables, and Attendance.
3.  **Finance Service:** Highly secure, transaction-heavy service for Fee management and Payments.
4.  **AI & Analytics Service:** Python-based service for processing predictions, insights, and LLM integrations. Needs independent GPU/CPU scaling.
5.  **Communication Service:** Asynchronous service for managing SMS, Email, and Push Notifications.
6.  **File/Document Service:** Manages S3 uploads and document metadata.

---

## 2. Multi-school Scalability Strategy

### Database Scaling
As the platform grows to thousands of schools, the "Shared Database" model will evolve:
*   **Vertical Scaling:** Initially upgrade RDS instances.
*   **Read Replicas:** Distribute read-heavy traffic (Reports, Dashboard).
*   **Database Sharding:** When a single Postgres instance reaches its limits (approx 5-10TB), we will shard by `school_id`. Each shard will contain a subset of schools.
*   **Citus Data (PostgreSQL Extension):** Consider Citus for seamless horizontal scaling of Postgres.

### Application Scaling
*   **Stateless Servers:** All application servers must be stateless to allow horizontal scaling behind a Load Balancer.
*   **Caching Strategy:** Use Redis for:
    *   Tenant configuration and settings.
    *   Session data.
    *   Hot analytics (e.g. current day attendance count).

---

## 3. Reporting and Analytics Scalability
Directly querying the production OLTP database for complex analytics can degrade performance.
*   **Read-Only Replicas:** Use for simple, near real-time dashboards.
*   **ETL to Data Warehouse:** For complex multi-year trends and AI training, stream data to a Data Warehouse (e.g., Snowflake, BigQuery, or a separate Postgres instance optimized for OLAP).

---

## 4. Performance Optimization
*   **Database Partitioning:** Use Postgres declarative partitioning by `school_id` and `academic_year` for heavy tables.
*   **Connection Pooling:** Use `PgBouncer` to manage thousands of database connections.
*   **CDN:** Use Content Delivery Networks for global assets (Logo, Profile Pictures, Documents).

## 5. Summary Roadmap
*   **Year 1 (0-100 Schools):** Modular Monolith, Single RDS instance with Read Replica.
*   **Year 2-3 (100-500 Schools):** Extract AI and Communication microservices. Implement Table Partitioning.
*   **Year 4+ (1000+ Schools):** Full Microservices architecture. Shard database by Tenant/School.
