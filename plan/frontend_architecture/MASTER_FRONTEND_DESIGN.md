# Tanweer Master Frontend Technical Architecture

## Executive Summary
This document provides the implementation-ready frontend architecture for the Tanweer School Management System. It leverages modern industry standards to ensure a scalable, accessible, and performant user experience.

## 1. Technical Stack Overview
- **Framework:** Next.js (App Router).
- **Language:** TypeScript.
- **UI Components:** Shadcn UI + Radix UI.
- **Styling:** Tailwind CSS.
- **Data Fetching:** TanStack (React) Query.
- **State Management:** Zustand.
- **Forms:** React Hook Form + Zod.

## 2. Architecture Modules
- **Structure and Organization:** [01_structure.md](./01_structure.md)
- **State Management & API Integration:** [02_state_api.md](./02_state_api.md)
- **Authentication & Routing:** [03_auth_routing.md](./03_auth_routing.md)
- **Theme & UI Components:** [04_theme_ui.md](./04_theme_ui.md)

## 3. Key Design Decisions

| Category | Decision | Justification |
| :--- | :--- | :--- |
| **Directory Layout** | Feature-based | Better scalability for 12+ modules compared to flat folder structures. |
| **Server Components** | Maximize usage | Reduces JS bundle size and improves initial load performance. |
| **Validation** | Zod (Shared) | Ensures type safety from API response down to form inputs. |
| **Auth Strategy** | Stateless JWT | Aligns with the backend SaaS architecture for horizontal scaling. |
| **UI Primitive** | Shadcn UI | Best balance of ownership, accessibility, and modern aesthetics. |

## 4. Implementation Guidelines
*   **Module Isolation:** Do not import from one feature's `components/` into another. Use the public API (index.ts) or move to `components/common/`.
*   **Type Safety:** Never use `any`. Always define interfaces for API responses and component props.
*   **Accessibility:** All components must be keyboard navigable and ARIA-compliant (Radix helps with this).
*   **Performance:** Monitor bundle sizes and use `next/dynamic` for large, non-critical components.
