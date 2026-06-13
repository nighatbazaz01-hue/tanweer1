# Tanweer Development Roadmap: Sprint 2 (Weeks 3-4)

## Goal
Implement the core student enrollment lifecycle from lead capture to student profiles.

## Features
*   Admission Leads and Application management.
*   Document upload and verification.
*   Student enrollment conversion.
*   Student and Parent directory/profiles.

## Database Work
*   Implement `admission_leads`, `admission_applications`, `application_documents`.
*   Implement `students`, `parents`, `student_parent_mappings`, `student_enrollments`.

## Backend Work
*   Implement Admissions module (Lead capture, Application processing).
*   Implement Student and Parent modules.
*   Setup AWS S3 integration for document storage.

## Frontend Work
*   Implement Admissions Kanban board/Pipeline view.
*   Create Multi-step enrollment form.
*   Build Student and Parent Directory with profile views.

## Testing
*   Unit tests for enrollment business logic.
*   Integration tests for S3 file uploads.
*   QA verification of application-to-student conversion flow.

## Deliverables
*   Admissions management dashboard.
*   Ability to enroll students and manage their profiles.
*   Document management system.
