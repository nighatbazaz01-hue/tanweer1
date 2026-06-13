# Backend Decision: API, Caching, and Event Architecture

## 1. API Architecture: REST (with JSON:API specs)

### Why it was selected
REST was selected as the primary API architecture because of its simplicity, ubiquity, and ease of caching. For a school management system where many operations are standard CRUD (Admissions, Fees, Attendance), REST provides a predictable and standard way to interact with resources. We will follow JSON:API specifications to ensure consistency in filtering, sorting, and pagination.

### Alternatives considered
*   **GraphQL:** Highly flexible for complex frontend queries, but introduces complexity in security (rate limiting is harder), caching (standard HTTP caching doesn't work), and can lead to performance issues if not carefully managed (N+1 problems).
*   **gRPC:** Excellent for internal microservice communication due to performance, but not suitable for direct client-to-server communication in a web-based SaaS.

### Pros and Cons
**Pros:**
*   **Predictability:** Standardized endpoints.
*   **Caching:** Leverages HTTP-level caching.
*   **Ecosystem:** Total support from all client-side languages and tools.

**Cons:**
*   **Over-fetching/Under-fetching:** Can be less efficient than GraphQL for complex UI views.
*   **Versioning:** Requires explicit versioning (e.g., `/v1/`).

---

## 2. Caching Strategy: Redis (Multi-layered)

### Why it was selected
Redis is the industry standard for high-performance in-memory caching. In Tanweer, it will be used for:
1.  **Session Storage:** For fast authentication lookups.
2.  **Tenant Configuration:** To quickly load school-specific settings.
3.  **Hot Data:** Caching frequently accessed data like the current day's attendance summary or dashboard KPIs.

### Alternatives considered
*   **Memcached:** Faster for simple key-value pairs but lacks the advanced data structures (Hashes, Sets, Sorted Sets) and persistence options provided by Redis.
*   **In-memory (Local):** Not suitable for a horizontally scaled environment as cache wouldn't be shared across server instances.

### Pros and Cons
**Pros:**
*   **Performance:** Sub-millisecond latency.
*   **Versatility:** Supports complex data structures.
*   **Pub/Sub:** Can also be used for lightweight event signaling.

**Cons:**
*   **Complexity:** Requires managing a separate infrastructure component.
*   **Cost:** Memory-bound storage is more expensive than disk.

---

## 3. Event Architecture: Redis Pub/Sub + BullMQ (Task Queue)

### Why it was selected
For an initial modular monolith moving towards microservices, Redis-backed BullMQ is an excellent choice for managing asynchronous events and background jobs (e.g., sending SMS, processing report cards). It provides reliable job processing with retries and concurrency control without the overhead of a full Kafka cluster.

### Alternatives considered
*   **RabbitMQ:** Very robust but requires more management overhead and a different protocol (AMQP).
*   **Apache Kafka:** Best for massive event streaming, but overkill for the initial phases of Tanweer.
*   **AWS SNS/SQS:** Great for cloud-native, but introduces vendor lock-in.

### Pros and Cons
**Pros:**
*   **Integration:** Works seamlessly with the existing Redis instance.
*   **Developer Experience:** BullMQ has excellent TypeScript support.
*   **Reliability:** Supports delayed jobs, retries, and parent/child job dependencies.

**Cons:**
*   **Throughput:** Not as high as Kafka for millions of events per second.
*   **Memory Usage:** Can consume significant Redis memory if queues are not managed.
