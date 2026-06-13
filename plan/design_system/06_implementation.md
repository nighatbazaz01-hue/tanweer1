# Tanweer Design System: Implementation and Accessibility

## 1. Themes: Light and Dark Mode

### Strategy
*   Use CSS Variables mapped to Tailwind configuration.
*   Default to System preference, toggleable via User settings.

### Color Mapping (Variables)
| Token | Light Mode | Dark Mode |
| :--- | :--- | :--- |
| `--background` | #FFFFFF | #0F172A |
| `--foreground` | #0F172A | #F8FAFC |
| `--card` | #F8FAFC | #1E293B |
| `--border` | #E2E8F0 | #334155 |
| `--primary` | #2563EB | #3B82F6 |

---

## 2. Accessibility Standards (WCAG 2.1 AA)

### Requirements
*   **Contrast:** Minimum 4.5:1 for body text, 3:1 for large text/UI components.
*   **Keyboard Navigation:** All interactive elements must have a visible `:focus-visible` state.
*   **Aria Labels:** Required for icon-only buttons and complex widgets.
*   **Screen Readers:** Use semantic HTML tags (`<nav>`, `<main>`, `<footer>`, `<aside>`).

---

## 3. Implementation in Next.js + Tailwind
*   **Library:** `@shadcn/ui` (Copy-paste model).
*   **Forms:** `react-hook-form` with `@hookform/resolvers/zod`.
*   **State:** Local state via `useState`, global via `Zustand`.
*   **Transitions:** Use `framer-motion` for subtle animations (modal entry, drawer slide).

## 4. Design-to-Code Workflow (Figma)
*   **Variables:** Sync Figma color/spacing variables with `tailwind.config.ts`.
*   **Components:** Developers must use the `src/components/ui` folder for all foundational elements.
*   **Naming:** Maintain 1:1 naming between Figma layers and React component names.
