# Tanweer High-Level Architecture

## 1. Overview
Tanweer is designed as a cloud-native, multi-tenant SaaS School Management System. The architecture prioritizes scalability, security, and AI integration.

## 2. Multi-tenancy Strategy: Shared Database with Row Level Security (RLS)
To balance operational efficiency and tenant isolation, Tanweer will utilize a **Shared Database, Shared Schema** approach powered by PostgreSQL Row Level Security (RLS).

### Why this model?
*   **Cost Efficiency:** Lower overhead compared to database-per-tenant.
*   **Operational Simplicity:** Single schema migration, unified backups.
*   **Scalability:** Easier to implement global analytics and cross-tenant AI training (with anonymization).
*   **Isolation:** Postgres RLS ensures that one school's users can never access another school's data at the engine level.

### Implementation
*   Every table (except global system tables) will include a `school_id` (UUID) column.
*   Application server will set a session variable `app.current_school_id` upon authentication.
*   RLS policies will enforce: `WHERE school_id = current_setting('app.current_school_id')::uuid`.

## 3. High-Level Tech Stack
*   **Database:** PostgreSQL (Relational data, JSONB for flexible attributes, pgvector for AI embeddings).
*   **Caching:** Redis (Session management, frequently accessed config, leaderboard data).
*   **Backend:** Node.js/NestJS or Python/FastAPI (for AI/Data science compatibility).
*   **Frontend:** React/Next.js with Tailwind CSS.
*   **AI/ML:** OpenAI API / Anthropic / Local LLMs via LangChain, Python-based microservices for specialized ML models.
*   **File Storage:** AWS S3 or compatible object storage (for documents, homework submissions).

## 4. Architectural Patterns
*   **Modular Monolith to Microservices:** Start with a modular monolith for rapid development, with clear domain boundaries to allow extraction into microservices (e.g., Payments, AI, Communication) as load increases.
*   **Event-Driven Architecture:** Use a message broker (RabbitMQ/NATS/AWS SNS/SQS) for asynchronous tasks like sending SMS, processing report cards, or AI insight generation.
*   **API-First Design:** All functionality exposed via RESTful or GraphQL APIs.

## 5. Deployment Strategy
*   **Containerization:** Docker/Kubernetes for orchestration.
*   **Regional Deployment:** Support for multi-region deployment to comply with local data sovereignty laws (e.g., GDPR, local education ministry requirements).
