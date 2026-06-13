# API Specification: Authentication and Users

## 1. Authentication Module

### POST /api/v1/auth/login
Authenticate a user and return tokens.
*   **Request Body:**
    ```json
    {
      "email": "user@school.com",
      "password": "securepassword",
      "device_id": "optional-id"
    }
    ```
*   **Response (200 OK):**
    ```json
    {
      "access_token": "jwt-string",
      "refresh_token": "jwt-string",
      "user": { "id": "uuid", "email": "user@school.com", "roles": ["Teacher"] }
    }
    ```
*   **Business Rules:** Logs login history and device tracking.

### POST /api/v1/auth/refresh
Get a new access token using a refresh token.
*   **Request Body:** `{ "refresh_token": "string" }`
*   **Response (200 OK):** `{ "access_token": "new-jwt" }`

### POST /api/v1/auth/logout
Invalidate the current session.
*   **Response:** `204 No Content`

---

## 2. User Management Module

### GET /api/v1/users/profile
Get current user profile and school context.
*   **Permission:** `None (Authenticated only)`
*   **Response (200 OK):**
    ```json
    {
      "id": "uuid",
      "first_name": "John",
      "last_name": "Doe",
      "school": { "id": "uuid", "name": "Tanweer Academy" },
      "permissions": ["students.view", "attendance.mark"]
    }
    ```

### PATCH /api/v1/users/profile
Update personal profile details.
*   **Request Body:** `{ "first_name": "string", "profile_picture_url": "url" }`
*   **Validation:** First name cannot be empty.

### GET /api/v1/users
List school users (Admin only).
*   **Permission:** `users.view`
*   **Pagination:** Supported.
*   **Filtering:** `filter[role_id]`, `filter[is_active]`.
*   **Search:** Searches name and email.
