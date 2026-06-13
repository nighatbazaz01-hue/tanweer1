# Frontend Architecture: State Management and API Integration

## 1. Server State: TanStack (React) Query
We will use React Query as the primary layer for all server-side data fetching, caching, and synchronization.

### Implementation Strategy:
*   **Centralized Query Client:** Initialized in the root layout with standard defaults (staleTime: 5 mins, retry: 1).
*   **Custom Hooks:** Every API endpoint will have a corresponding custom hook in its respective `features/*/hooks/` folder.
    *   `useGetStudents()`
    *   `useMarkAttendance()`
*   **Optimistic Updates:** Implement for simple actions like toggling student presence or liking a notice to improve perceived performance.
*   **Prefetching:** Leverage Next.js Server Components to prefetch critical data on the server and dehydrate it for the client.

## 2. Global UI State: Zustand
Zustand will be used for lightweight, global UI state that does not belong in the server state.

### Usage Examples:
*   Sidebar collapse state.
*   Multi-school selector state.
*   AI Assistant drawer state.
*   Active academic year context.

## 3. Form Management and Validation
*   **Library:** React Hook Form (RHF).
*   **Validation:** Zod.
*   **Integration:** We will use the `@hookform/resolvers/zod` to link RHF with Zod schemas.
*   **Shadcn Integration:** Standardize forms using the Shadcn `<Form />` wrapper which provides accessible, styled, and validated inputs.

## 4. API Integration Layer
*   **Client:** Axios instance with interceptors.
*   **Interceptors:**
    *   **Request:** Automatically attach the JWT `Authorization` header and the `X-School-Id` header from the active context.
    *   **Response:** Handle 401 Unauthorized globally by redirecting to login and clearing tokens.
*   **Type Safety:** Generate or manually define TypeScript interfaces matching the [MASTER_API_SPEC.md](../api_specification/MASTER_API_SPEC.md).
