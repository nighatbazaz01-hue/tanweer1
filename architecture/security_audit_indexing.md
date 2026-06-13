# Audit, Security, and Indexing Strategy

## 1. Audit Strategy: Temporal Change Tracking
To satisfy the "Every critical action must be auditable" requirement, Tanweer will implement a two-tier audit system.

### Tier 1: Generic Audit Metadata
Every table will include the following standard columns:
*   `created_at`: TIMESTAMP
*   `created_by`: UUID (FK to users.id)
*   `updated_at`: TIMESTAMP
*   `updated_by`: UUID (FK to users.id)
*   `deleted_at`: TIMESTAMP (for Soft Deletes)
*   `deleted_by`: UUID

### Tier 2: Comprehensive Change History (Audit Log)
A centralized `audit_logs` table will store the delta of changes.

| Column | Type | Description |
| :--- | :--- | :--- |
| id | BIGINT | PRIMARY KEY |
| school_id | UUID | Partition key |
| table_name | VARCHAR(100) | |
| record_id | UUID | |
| action | VARCHAR(20) | INSERT, UPDATE, DELETE |
| old_values | JSONB | Data before change |
| new_values | JSONB | Data after change |
| user_id | UUID | Actor |
| ip_address | INET | |
| timestamp | TIMESTAMP | |

**Implementation:** Application-level middleware or Database Triggers (preferred for integrity) will populate this table.

---

## 2. Security Strategy

### Row Level Security (RLS)
As defined in the high-level architecture, PostgreSQL RLS will be the primary barrier for multi-tenancy.
```sql
CREATE POLICY school_isolation_policy ON students
    USING (school_id = current_setting('app.current_school_id')::uuid);
```

### Data Encryption
*   **At Rest:** AES-256 encryption provided by the cloud provider (RDS/EBS).
*   **PII (Personally Identifiable Information):** Sensitive fields like `salary_details`, `medical_info`, and `password_hash` will be encrypted at the application level before storage.
*   **In Transit:** TLS 1.3 for all API and DB connections.

### Access Control (RBAC)
*   Fine-grained permissions (e.g., `attendance.mark`, `fees.view_own`, `fees.manage_all`).
*   Roles are school-scoped, allowing a user to be a "Teacher" in School A and a "Parent" in School B.

---

## 3. Indexing Strategy

### Standard Indexes
*   **B-Tree:** Primary keys, foreign keys, and unique constraints.
*   **Partial Indexes:** For active records (e.g., `CREATE INDEX ... WHERE deleted_at IS NULL`).
*   **Composite Indexes:** 
    *   `(school_id, academic_year_id)` on transaction tables.
    *   `(school_id, section_id)` on student/attendance tables.

### Search & Analytics Indexes
*   **GIN Indexes:** On `JSONB` columns like `metadata`, `medical_info` for flexible searching.
*   **Full-Text Search:** Postgres `tsvector` on student names, book titles, and communication content.
*   **pgvector (IVFFlat/HNSW):** On `ai_vector_store.embedding` for semantic search.

---

## 4. Database Implementation Recommendations
*   **PostgreSQL 16+**: For advanced RLS performance and JSON features.
*   **UUID v7**: Use UUIDs that are sortable by time for better index performance.
*   **Partitioning**: Declarative partitioning by `school_id` for large tables (Attendance, Audit Logs, Communication) to ensure performance remains stable as more schools join.
