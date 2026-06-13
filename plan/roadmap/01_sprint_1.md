# Tanweer Development Roadmap: Sprint 1 (Weeks 1-2)

## Goal
Establish the technical foundation, authentication system, and core organizational structure.

## Features
*   Multi-tenant School registration.
*   User Login/Logout with JWT + Refresh Tokens.
*   School, Campus, and Academic Year management.
*   Basic Role-Based Access Control (RBAC).

## Database Work
*   Implement `schools`, `campuses`, `academic_years`, `users`, `roles`, and `permissions` tables.
*   Enable PostgreSQL Row Level Security (RLS) on all multi-tenant tables.
*   Setup standard audit metadata columns.

## Backend Work
*   Setup NestJS project with PostgreSQL and Redis.
*   Implement Auth module (Passport.js + JWT).
*   Implement Organization module (CRUD for Schools/Campuses).
*   Setup Zod validation pipe and Pino logger.

## Frontend Work
*   Setup Next.js project with Tailwind CSS and Shadcn UI.
*   Implement Auth flow (Login page, token handling).
*   Create Sidebar and Topbar layouts.
*   Implement Organization settings pages.

## Testing
*   Unit tests for Auth services.
*   Integration tests for RLS (ensure tenant isolation).
*   API tests for login and profile endpoints.

## Deliverables
*   Functional Login system.
*   School Admin dashboard with basic organization settings.
*   Multi-tenant infrastructure verified.
