# Tanweer: COMPLETE DATABASE ARCHITECTURE AND DOMAIN MODEL

## Executive Summary
This document serves as the master guide for the Tanweer School Management System's architecture. It consolidates the findings from the detailed design phase to provide a unified view for stakeholders and developers.

## 1. High-Level Architecture
- **Model:** Cloud-native SaaS using a shared database with PostgreSQL Row Level Security (RLS) for multi-tenancy.
- **Tech Stack:** Node.js/Python, PostgreSQL, Redis, AWS S3.
- **Full Details:** [high_level_architecture.md](./high_level_architecture.md)

## 2. Domain Model
- **Core Entities:** Schools, Campuses, Classes, Students, Teachers, Parents, Fees, Exams, AI.
- **Domain Diagram:** Included in Mermaid format.
- **Full Details:** [domain_model.md](./domain_model.md)

## 3. Database Schema
The database is divided into logical modules for better manageability:
- **Core & Users:** Organization structure and RBAC. [schema_core_users.md](./schema_core_users.md)
- **Admissions & Students:** Lead capture to enrollment and student records. [schema_admissions_students.md](./schema_admissions_students.md)
- **Academics & Attendance:** Staff, Timetables, Attendance, Exams, and Assignments. [schema_academics_attendance.md](./schema_academics_attendance.md)
- **Operations & Finance:** Fees, Library, Transport, Inventory, and Communications. [schema_operations_finance.md](./schema_operations_finance.md)
- **AI Requirements:** Assistant conversations, Insights, and Vector storage. [schema_ai.md](./schema_ai.md)

## 4. Operational Strategies
- **Audit & Security:** Tiered audit logging, RLS policies, and PII encryption. [security_audit_indexing.md](./security_audit_indexing.md)
- **Indexing:** B-Tree, GIN, and Vector indexes for performance. [security_audit_indexing.md](./security_audit_indexing.md)
- **Scalability:** Roadmap for sharding and microservices. [scalability_roadmap.md](./scalability_roadmap.md)

## 5. Security Considerations
- Role-Based Access Control (RBAC) at the application level.
- Row-Level Security (RLS) at the database level for tenant isolation.
- Multi-Factor Authentication (MFA) and Device Tracking for all user types.
- Data encryption at rest and in transit.

## 6. AI Readiness
- Support for `pgvector` for Retrieval Augmented Generation (RAG).
- Context-aware conversation history for AI assistants.
- Dedicated insight tables for predictive analytics (Risk, Performance, Finance).
- Tables for AI-generated content with versioning and user refinement.

## 7. Future Microservice Boundaries
- Identity, Academic, Finance, AI & Analytics, Communication, and File Service.
