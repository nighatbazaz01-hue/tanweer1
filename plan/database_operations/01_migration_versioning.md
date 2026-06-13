# Database Migration and Versioning Strategy

## 1. Database Versioning Strategy
Tanweer will use a **Code-first ORM-based** versioning system. 

### Core Principles:
*   **Source of Truth:** The database schema is defined in code (models).
*   **Version Tracking:** A dedicated `_migrations` table will track applied migration versions (unique ID, name, applied_at).
*   **Immutability:** Once a migration is committed to the main branch, it must never be altered. Bug fixes require a new migration.
*   **Sequential Order:** Migrations are timestamped and applied in chronological order.

---

## 2. Migration Strategy: Zero-Downtime
To support enterprise-scale availability, Tanweer will follow a **Zero-Downtime (Expand and Contract)** migration pattern.

### The Expand and Contract Pattern:
For breaking changes (e.g., renaming a column), the process is split into three phases:

1.  **Phase 1 (Expand):** Add the new column/table. Keep the old one. Code writes to both but reads from the old one.
2.  **Phase 2 (Migrate):** Backfill existing data from the old column to the new one. Code switches to reading from the new column.
3.  **Phase 3 (Contract):** Once verified, remove the old column/table in a separate migration.

### Operational Guardrails:
*   **Advisory Locks:** Use `pg_advisory_xact_lock` during migration to prevent concurrent migration attempts in a clustered environment.
*   **No Long-Running Transactions:** Migrations must avoid large data backfills in a single transaction to prevent table locking. Backfills should be batched.
*   **Pre-deployment Validation:** All migrations must be tested against a cloned production dataset (anonymized) in the staging environment.
