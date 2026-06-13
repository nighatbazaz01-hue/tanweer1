# Backend Decision: Security (Authentication and Authorization)

## 1. Authentication: JWT with Refresh Tokens

### Why it was selected
JWT (JSON Web Tokens) with a short-lived Access Token and a long-lived Refresh Token (stored in a Secure, HttpOnly cookie) is the standard for modern SaaS applications. It allows for stateless authentication, which is crucial for horizontal scaling. We will use `Passport.js` within NestJS for implementation.

### Alternatives considered
*   **Session-based Authentication:** Simple but requires the server to store state, making it harder to scale across multiple instances without a shared session store (like Redis).
*   **API Keys:** Good for programmatic access but not suitable for user-facing web and mobile applications.

### Pros and Cons
**Pros:**
*   **Stateless:** Reduces database/cache load for every request.
*   **Security:** Refresh tokens allow for immediate revocation and short access token lifespans.
*   **Scalability:** Perfect for distributed systems.

**Cons:**
*   **Revocation Complexity:** Revoking an access token before it expires is difficult without a blacklist (usually in Redis).
*   **Payload Size:** Large tokens can increase request overhead.

---

## 2. Authorization: Hybrid RBAC and Row Level Security (RLS)

### Why it was selected
For Tanweer, we will use **Role-Based Access Control (RBAC)** at the application layer to determine *what actions* a user can perform (e.g., "Can I edit student records?"). This will be integrated with **PostgreSQL Row Level Security (RLS)** to determine *what data* they can see (e.g., "Can I only see students in my school?").

### Alternatives considered
*   **ABAC (Attribute-Based Access Control):** Extremely flexible but adds significant complexity to implementation and management.
*   **Application-only Filtering:** Relying solely on `WHERE school_id = ?` in code is prone to developer error and data leakage.

### Pros and Cons
**Pros:**
*   **Defense in Depth:** Even if a developer forgets a `WHERE` clause, RLS prevents cross-tenant data access.
*   **Performance:** RLS is highly optimized within the database engine.
*   **Standardization:** RBAC is well-understood by administrators.

**Cons:**
*   **RLS Overhead:** Slightly more complex database migrations and connection pool management (must set session variables).
*   **Debugging:** Issues with RLS can be harder to trace than application code.

---

## 3. Integration with DB RLS
Upon every request, the backend will:
1.  Verify the JWT and extract the `user_id` and `school_id`.
2.  Use a database connection from the pool.
3.  Execute: `SET LOCAL app.current_school_id = '<school_id>';`
4.  Run the actual query, which will be filtered by the database engine.
