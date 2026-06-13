# Tanweer Development Roadmap: Sprint 4 (Weeks 7-8)

## Goal
Implement the financial infrastructure for fee collection and billing.

## Features
*   Fee Structure definition (Categories, Amounts).
*   Scholarship and Discount management.
*   Fee collection and Payment recording.
*   Parent portal for online payments.

## Database Work
*   Implement `fee_categories`, `fee_structures`, `student_fee_discounts`.
*   Implement `fee_payments` and receipt tracking.

## Backend Work
*   Implement Finance module (Invoicing, Collections).
*   Integrate Payment Gateway (Stripe/Razorpay).
*   Setup BullMQ for automated fee reminder emails.

## Frontend Work
*   Build Fee collection counter for Accountants.
*   Implement Payment history and Invoice view in Parent portal.
*   Create Fee setup dashboard for Admins.

## Testing
*   Unit tests for fee calculation logic (including discounts).
*   Security audit for payment processing endpoints.
*   QA verification of payment success/failure flows.

## Deliverables
*   Functional fee collection system.
*   Automated receipts and billing history.
*   Parent portal billing integration.
