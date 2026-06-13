# Tanweer Master API Specification

## Executive Summary
This document provides the implementation-ready API contract for the Tanweer School Management Platform. It consolidates standards, endpoints, and business rules across all modules.

## 1. API Standards and Conventions
- **Base URL:** `https://api.tanweer.com/api/v1`
- **Full Standards:** [01_standards.md](./01_standards.md)

## 2. Core Modules
- **Authentication and Users:** [02_auth_users.md](./02_auth_users.md)
- **Admissions, Students, and Parents:** [03_admissions_students.md](./03_admissions_students.md)

## 3. Academic and Staff Modules
- **Staff and Academics:** [04_staff_academic.md](./04_staff_academic.md)
- **Exams, Fees, and Communication:** [05_exams_fees_comms.md](./05_exams_fees_comms.md)

## 4. Strategic Modules
- **Reports and AI Assistant:** [06_reports_ai.md](./06_reports_ai.md)

## 5. Global Error Codes Reference

| Error Code | HTTP Status | Description |
| :--- | :--- | :--- |
| `AUTH_FAILED` | 401 | Invalid credentials or token. |
| `FORBIDDEN` | 403 | User lacks required RBAC permission. |
| `VALIDATION_ERROR` | 400 | Request payload failed Zod validation. |
| `CONFLICT_TIMETABLE` | 409 | Teacher or Room overlap detected. |
| `TENANT_MISMATCH` | 403 | Attempted to access data outside current school_id. |
| `AI_CREDITS_EXHAUSTED` | 429 | School has reached its monthly AI usage limit. |

## 6. Implementation Notes for Backend Developers
- All endpoints must verify the `school_id` from the JWT before calling the database.
- Use `Zod` for request validation as per the `04_operations.md` backend decision.
- Ensure `Pino` logs include the `request_id` and `user_id` for traceability.
- Follow the JSON:API standards for all collection endpoints to ensure consistent filtering/sorting.
