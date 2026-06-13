# Tanweer Design System: Grid and Layout

## 1. Responsive Breakpoints (Tailwind Defaults)
*   **Mobile (sm):** 640px
*   **Tablet (md):** 768px
*   **Laptop (lg):** 1024px
*   **Desktop (xl):** 1280px
*   **Wide (2xl):** 1536px

## 2. Grid System
*   **Columns:** 12-column grid for desktop views.
*   **Gutter:** 16px (md) or 24px (lg).
*   **Container:** Max-width of 1440px for content area.

## 3. Global Layout Patterns

### Main App Shell
*   **Sidebar Width:** 256px (expanded) / 64px (collapsed).
*   **Topbar Height:** 64px.
*   **Content Padding:** 24px (lg) / 16px (sm).

### Page Structures
*   **Dashboard:** Multi-column masonry or fixed-grid KPI cards at top, followed by activity feed and tables.
*   **Form Pages:** Single-column centered (max 640px) or two-column (split between info and inputs).
*   **Directory/Listings:** Full-width DataTable with top-aligned filters and search.

## 4. Mobile Patterns
*   **Navigation:** Bottom Tab Bar for primary actions + Hamburger menu for full sidebar.
*   **Forms:** Stacked inputs (full-width), primary actions pinned to bottom or top-right.
*   **Modals:** Convert to Full-screen drawers (Bottom Sheets) on mobile.
