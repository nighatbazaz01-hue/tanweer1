# Tanweer Master Database Operations Guide

## Executive Summary
This guide outlines the standards and procedures for managing the Tanweer PostgreSQL database environment. It covers the full lifecycle from initial migration to production recovery.

## 1. Core Strategies
- **Migration & Versioning:** [01_migration_versioning.md](./01_migration_versioning.md) (ORM-based, Zero-downtime Expand/Contract).
- **Seeding & PII:** [02_seeding_strategy.md](./02_seeding_strategy.md) (Automated anonymization, Demo datasets).
- **Reliability & Recovery:** [03_reliability_recovery.md](./03_reliability_recovery.md) (Forward-only rollbacks, PITR, Automated restore drills).

## 2. Migration Execution
- **Migration Plan:** [04_migration_plan.md](./04_migration_plan.md)
- **Dependency Graph:** Mermaid-based visualization of module relationships.
- **Initial Migration Order:** 14-step sequence ensuring FK integrity.

## 3. Operational Checklist for Developers
- [ ] Never alter a committed migration.
- [ ] Breaking changes must use the "Expand and Contract" pattern.
- [ ] Every migration must include an `up` and `down` function.
- [ ] Verify migrations against anonymized staging data before production.
- [ ] Database seeds for development must not contain real PII.

## 4. Disaster Recovery Targets (SLA)
*   **RPO (Recovery Point Objective):** < 5 minutes (via PITR).
*   **RTO (Recovery Time Objective):** < 4 hours (via automated restore drills).
