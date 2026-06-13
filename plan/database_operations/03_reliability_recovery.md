# Reliability, Recovery, and Rollback Strategy

## 1. Rollback Strategy
Tanweer prioritizes a **Forward-only** rollback approach to maintain data integrity in a multi-tenant environment.

### Forward-only Strategy (Preferred)
Instead of reverting to a previous state (which can cause data loss for new records created between migration and failure), we commit a "Fix-forward" migration.
*   **Process:** Identify the bug in the failed migration -> Create a new migration that corrects the schema/data -> Deploy.

### In-place Rollback (Emergency Only)
Only used in local or early staging environments if a migration fails during the deployment process before any application traffic hits the new schema.
*   **Requirement:** Every migration file MUST contain both an `up` and a `down` function.

---

## 2. Backup Strategy
*   **Continuous Backups:** Using RDS Point-in-Time Recovery (PITR) allowing for recovery to any second within the last 35 days.
*   **Daily Snapshots:** Full snapshots retained for 6 months for compliance.
*   **Multi-Region Replication:** Cross-region read-replicas for disaster recovery.

---

## 3. Backup Testing Strategy (Restore Drills)
Backups are only as good as their latest successful restore.

### Automated Restore Drills:
1.  **Weekly Restoration:** An automated process restores the latest snapshot to a temporary "Recovery Validation" instance.
2.  **Integrity Check:** A script runs a suite of sanity checks (e.g., "count students", "verify latest fee payment exists") on the restored instance.
3.  **Alerting:** If the restore fails or sanity checks don't pass, the DevOps team is alerted immediately.

### Performance Benchmarking:
*   Measure the time taken for a full restore monthly to ensure RTO (Recovery Time Objective) is within the SLA (e.g., < 4 hours).
