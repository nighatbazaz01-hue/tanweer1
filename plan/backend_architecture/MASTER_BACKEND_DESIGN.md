# Tanweer Master Backend Technical Architecture

## Executive Summary
This document outlines the implementation-ready backend technology stack for the Tanweer School Management System. Each decision has been made to support a scalable, secure, and multi-tenant SaaS platform.

## 1. Technology Decisions Matrix

| Category | Selection | Key Justification |
| :--- | :--- | :--- |
| **Programming Language** | [TypeScript](./01_language_framework.md) | Enterprise-grade type safety and developer productivity. |
| **Backend Framework** | [NestJS](./01_language_framework.md) | Modular, testable architecture; easy path to microservices. |
| **API Architecture** | [REST (JSON:API)](./02_api_events_caching.md) | Predictability, ubiquity, and excellent HTTP-level caching. |
| **Authentication** | [JWT + Refresh Tokens](./03_security.md) | Stateless, scalable authentication for multi-tenant SaaS. |
| **Authorization** | [RBAC + DB RLS](./03_security.md) | Defense-in-depth for strict tenant isolation. |
| **Validation** | [Zod](./04_operations.md) | TypeScript-first schema validation with type inference. |
| **Background Jobs** | [BullMQ](./04_operations.md) | Reliable, Redis-backed job processing with retries/cron. |
| **Event Architecture** | [Redis Pub/Sub + BullMQ](./02_api_events_caching.md) | Low-overhead asynchronous task management. |
| **Caching Strategy** | [Redis](./02_api_events_caching.md) | Sub-millisecond performance for sessions and config. |
| **Logging Strategy** | [Pino (JSON)](./04_operations.md) | High-performance structured logging for observability. |

## 2. Implementation Roadmap

### Phase 1: Modular Monolith
*   Initialize NestJS project with strict TypeScript settings.
*   Setup PostgreSQL with RLS and Redis for caching/sessions.
*   Implement Core modules (Auth, Schools, Users).

### Phase 2: Feature Expansion
*   Implement Admissions, Academics, and Finance modules.
*   Integrate BullMQ for background tasks (Email/SMS).
*   Add AI analytics ingestion pipelines.

### Phase 3: Scaling & Microservices
*   Extract AI, Communication, and Finance into independent services if needed.
*   Implement database sharding by `school_id`.

## 3. Developer Guidelines
*   **Documentation:** All endpoints must be documented with Swagger (OpenAPI).
*   **Testing:** Minimum 80% code coverage using Jest.
*   **Safety:** Never query tenant-specific tables without setting the `app.current_school_id` session variable.
