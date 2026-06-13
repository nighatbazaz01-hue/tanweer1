# Tanweer API Standards and Global Conventions

## 1. General Principles
*   **Protocol:** HTTPS only.
*   **API Style:** RESTful.
*   **Content Type:** `application/json`.
*   **Versioning:** URI-based, e.g., `/api/v1/...`.
*   **Tenant Context:** Every request must include a `school_id` either in the JWT or as a required header `X-School-Id` for school-scoped resources.

## 2. Pagination
We follow a consistent limit-offset approach for collections.
*   `GET /resource?page=1&limit=10`
*   **Response Envelope:**
    ```json
    {
      "data": [],
      "meta": {
        "total": 100,
        "page": 1,
        "limit": 10,
        "last_page": 10
      }
    }
    ```

## 3. Filtering and Sorting
*   **Filtering:** `GET /resource?filter[status]=active&filter[class_id]=uuid`
*   **Sorting:** `GET /resource?sort=created_at` (ascending) or `GET /resource?sort=-created_at` (descending).
*   **Searching:** `GET /resource?search=keyword` (Global search within the resource).

## 4. Response Standards

### Success (2xx)
*   `200 OK`: Resource retrieved or updated.
*   `201 Created`: Resource created successfully.
*   `204 No Content`: Resource deleted successfully.

### Errors (4xx, 5xx)
All errors return a standardized structure:
```json
{
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable message",
    "details": {} // Optional validation details
  }
}
```
*   `400 Bad Request`: Validation failure.
*   `401 Unauthorized`: Authentication missing or failed.
*   `403 Forbidden`: Authenticated but lack required permissions.
*   `404 Not Found`: Resource does not exist.
*   `429 Too Many Requests`: Rate limiting exceeded.

## 5. Security & Authorization
*   **JWT:** Required in the `Authorization: Bearer <token>` header.
*   **RBAC:** Permissions are enforced per endpoint (e.g., `students.view`, `fees.collect`).
*   **RLS:** Database Row Level Security automatically enforces school isolation based on the `school_id` in the authenticated context.
