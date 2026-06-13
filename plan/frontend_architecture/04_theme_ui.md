# Frontend Architecture: Theme System and UI Components

## 1. UI Library: Shadcn UI + Radix UI
We will use **Shadcn UI** as the foundation for our component library. It is built on top of **Radix UI** for accessibility and **Tailwind CSS** for styling.

### Why Shadcn UI?
*   **Ownership:** Components are copied into the `components/ui` folder, allowing for total customization.
*   **Accessibility:** Built-in support for WAI-ARIA patterns via Radix.
*   **Modern Design:** Clean, consistent, and professional look suitable for an ERP.

## 2. Styling: Tailwind CSS
Tailwind will be the exclusive styling engine.

### Theme Configuration (`tailwind.config.js`):
*   **Colors:** Define a primary palette (e.g., Tanweer Blue, Success Green, Danger Red).
*   **Typography:** Inter or a similar clean sans-serif for high readability.
*   **Spacing & Radii:** Consistent scales to maintain a cohesive look.

## 3. Theme System: next-themes
*   **Dark Mode Support:** Built-in using the `next-themes` provider.
*   **Contrast:** Ensure WCAG AA compliance for accessibility.

## 4. UI Patterns and Reusable Components
To ensure consistency, we will build several complex shared components in `components/common/`:

*   **DataTable:** A powerful wrapper around TanStack Table for sorting, filtering, and pagination.
*   **StatsCard:** Standardized card for dashboard KPIs.
*   **PageHeader:** Includes breadcrumbs, title, and primary actions.
*   **EmptyState/LoadingState:** Standardized UI for no-data and loading scenarios.
*   **AI Assistant Drawer:** A floating client component integrated with the AI backend service.

## 5. Iconography
*   **Library:** Lucide React (standard with Shadcn UI).
*   **Usage:** Consistent use of icons for navigation and actions.
