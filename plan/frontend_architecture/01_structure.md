# Frontend Architecture: Structure and Organization

## 1. Directory Structure (Next.js App Router)
Tanweer will use a **Feature-based** organization to ensure scalability and maintainability across 12+ modules.

```text
src/
├── app/                  # Next.js App Router (Routing, Layouts, Loading, Errors)
│   ├── (auth)/           # Authentication route group (Login, MFA)
│   ├── (dashboard)/      # Protected dashboard route group
│   │   ├── students/     # Student management routes
│   │   ├── fees/         # Fee management routes
│   │   └── ...           # Other modules
│   ├── api/              # Route handlers (if needed)
│   └── layout.tsx        # Global layout (Providers, Root Styles)
├── components/           # UI Components
│   ├── ui/               # Shadcn / Radix primitives (Shared across app)
│   ├── common/           # Custom shared components (DataTable, Modal, etc.)
│   └── forms/            # Shared form components (rhf + shadcn)
├── features/             # Feature-specific logic (Feature-first approach)
│   ├── admissions/       # Components, Hooks, Store, Types specific to Admissions
│   ├── students/
│   └── ...
├── hooks/                # Global reusable hooks
├── lib/                  # Library configurations (Axios, QueryClient, Utils)
├── services/             # Global API service layers
├── store/                # Global state (Zustand)
├── types/                # Global TypeScript interfaces/types
└── validation/           # Shared Zod schemas
```

## 2. Module Structure
Each feature in `features/` should be self-contained:
```text
features/admissions/
├── components/           # Module-specific components
├── hooks/                # Module-specific TanStack Query hooks (useLeads, useApprove)
├── services/             # Module-specific API calls
├── store/                # Module-specific Zustand slices
├── types.ts              # Module-specific interfaces
└── index.ts              # Public API for the feature
```

## 3. Component Strategy
*   **Atomic + Feature-based:** Use Shadcn UI for low-level "Atoms". Build complex "Molecules" and "Organisms" within specific feature folders.
*   **Server vs Client Components:** 
    *   **Server Components:** Use for layouts and data fetching that doesn't require interactivity.
    *   **Client Components:** Use for forms, interactive elements, and anything requiring hooks (useState, useQuery).
*   **Composition:** Favor composition over complex prop-drilling.
