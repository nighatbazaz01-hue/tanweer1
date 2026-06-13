# Frontend Architecture: Authentication and Routing

## 1. Authentication Flow
Tanweer uses a JWT-based authentication flow with Access and Refresh tokens.

### Flow Detail:
1.  **Login:** User submits credentials via a `(auth)/login` client component.
2.  **Token Storage:**
    *   `access_token` is stored in memory (via Zustand).
    *   `refresh_token` is stored in a Secure, HttpOnly cookie (managed by the backend).
3.  **Persistence:** On page refresh, a `useAuth` hook calls `/api/v1/users/profile` to restore the user session.
4.  **Automatic Refresh:** The Axios response interceptor catches 401 errors, attempts a `/auth/refresh` call, and retries the original request if successful.

## 2. Routing Strategy (Next.js App Router)
Routes are organized into logical groups to separate concerns and layouts.

### Route Groups:
*   **`(auth)`:** Public routes for Login, MFA, Password Reset.
*   **`(dashboard)`:** Protected routes requiring authentication. Uses a shared sidebar/topbar layout.
*   **`(admin)`:** Specific routes for Super Admin / Platform management.

## 3. Role-Based Access Control (RBAC) in UI

### Route Level:
*   **Next.js Middleware:** Used to protect the `(dashboard)` group. Checks for the presence of an auth cookie.
*   **Layout Guards:** Inside the `(dashboard)` layout, we verify if the user's role/permissions match the required context for the current path.

### Component Level:
*   **`<HasPermission />` Wrapper:** A higher-order component or wrapper to conditionally render UI elements based on user permissions.
    ```tsx
    <HasPermission permission="fees.collect">
      <Button>Collect Fee</Button>
    </HasPermission>
    ```

## 4. Multi-school / Tenant Context
*   The active `school_id` is stored in the `useSchoolStore` (Zustand).
*   When a user switches schools (if they have roles in multiple), the store is updated, and the page is refreshed to clear the query cache for the previous school.
