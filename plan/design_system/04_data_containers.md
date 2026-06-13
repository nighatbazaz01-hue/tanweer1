# Tanweer Design System: Data and Containers

## 1. DataTables (TanStack Table + Shadcn)

### Features
*   **Header:** Fixed position, sorting icons (up/down/none).
*   **Rows:** Alternating background colors (Zebra stripes), hover highlight.
*   **Pagination:** Pinned to bottom, "Previous", "Next", and Page numbers.
*   **Empty State:** Illustrated graphic + "Add New" primary action.

### Content Density
*   Default: 12px padding.
*   Compact: 8px padding (for complex admin views).

---

## 2. Cards

### Standard Card
*   **Border:** 1px Slate-200.
*   **Shadow:** subtle shadow-sm.
*   **Radius:** 8px (rounded-lg).
*   **Usage:** Dashboard KPIs, profile summaries, activity items.

### Interactive Card
*   **Hover:** blue-50 border, shadow-md.
*   **Usage:** Lead cards in Kanban, clickable reports.

---

## 3. Modals & Drawers

### Modals (Dialog)
*   **Backdrop:** Blur + 50% Black opacity.
*   **Position:** Center of screen.
*   **Closing:** "X" icon in top-right, Click outside, or "Esc" key.
*   **Usage:** Quick edits, confirmations, small forms.

### Drawers (Sheet)
*   **Position:** Slips in from the right.
*   **Usage:** AI Assistant, Detailed filtering panels, Student profile quick-view.
*   **Mobile:** Slips in from the bottom.

---

## 4. Toasts & Alerts
*   **Toasts:** Bottom-right, auto-dismiss after 5s.
*   **Alerts:** Inline at the top of content, used for system-wide notices or critical errors.
