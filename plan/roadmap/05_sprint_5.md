# Tanweer Development Roadmap: Sprint 5 (Weeks 9-10)

## Goal
Add evaluation tools, school-wide communication, and AI-powered assistance.

## Features
*   Exam Plans and Mark Entry.
*   School Announcements, circulars, and SMS alerts.
*   AI Assistant MVP (Basic data queries).
*   AI Content Generation (Lesson plans).

## Database Work
*   Implement `exam_plans`, `exam_subjects`, `exam_results`.
*   Implement `communications` and `announcements`.
*   Implement `ai_conversations`, `ai_messages`, `ai_generated_content`.
*   Setup `ai_vector_store` for RAG.

## Backend Work
*   Implement Examination module (Grading/Marks).
*   Implement Communication module (SMS/Email/Push).
*   Integrate LLM API (OpenAI/Anthropic) via LangChain.
*   Implement RAG pipeline for school policies/curriculum.

## Frontend Work
*   Create Exam mark entry sheets and result views.
*   Build Communication center (Compose/Inbox).
*   Integrate AI Chat drawer across all roles.
*   Build AI Generator workspace for Teachers.

## Testing
*   AI evaluation tests for response accuracy and safety.
*   Integration testing for SMS/Email providers.
*   UAT for report card generation.

## Deliverables
*   Functional exam management and grading.
*   Multi-channel communication system.
*   AI Assistant for automated queries and content creation.
