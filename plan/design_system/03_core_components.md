# Tanweer Design System: Core Components

## 1. Buttons

### Variants
*   **Primary:** Solid Tanweer Blue, White text.
*   **Secondary:** Outline (Slate), Slate text.
*   **Ghost:** No background, Blue text.
*   **Danger:** Solid Rose, White text.

### States
*   **Hover:** 10% darker background.
*   **Active:** 20% darker background, subtle scale down.
*   **Disabled:** Opacity 50%, grayscale, `cursor-not-allowed`.
*   **Loading:** Replace text with a spinning loader icon.

---

## 2. Inputs & Forms

### Text Input / Textarea
*   **Label:** Above the input, 12px Semibold.
*   **Placeholder:** Slate-400, italicized hints for complex fields.
*   **Focus State:** 2px Blue ring, White background.
*   **Error State:** Red border, helper text below in Red.

### Select / Multi-select
*   Uses Shadcn `Select` component.
*   Dropdown options with search for lists > 10 items.

### Form Layout (React Hook Form + Zod)
*   **Validation:** Trigger on `blur` and `submit`.
*   **Success Feedback:** Optional checkmark or toast on submission.
*   **Error Feedback:** Summary at the top for long forms + inline errors.

---

## 3. Checkboxes & Toggles
*   **Size:** 16px x 16px.
*   **Toggle:** Blue background when ON, Slate-200 when OFF.
*   **Labels:** To the right of the control.
