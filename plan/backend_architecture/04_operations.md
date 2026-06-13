# Backend Decision: Operational Frameworks

## 1. Validation Framework: Zod + NestJS ValidationPipe

### Why it was selected
Zod is a TypeScript-first schema declaration and validation library. It provides a highly intuitive API for defining data structures and automatically infers TypeScript types from those schemas. Using it with NestJS's `ValidationPipe` ensures that all incoming API request bodies are validated before they even reach the controller logic.

### Alternatives considered
*   **class-validator:** The traditional NestJS choice. It uses decorators, which can be less flexible for complex conditional validations compared to Zod's functional approach.
*   **Joi:** Very powerful but lacks native TypeScript type inference, requiring developers to define both the schema and the TypeScript interface manually.

### Pros and Cons
**Pros:**
*   **Type Safety:** One source of truth for both schema and types.
*   **Flexibility:** Supports complex nested objects and custom logic.
*   **Ecosystem:** Growing community and excellent documentation.

**Cons:**
*   **Performance:** Slightly slower than simple manual checks, though insignificant for most workloads.
*   **Bundle Size:** Adds a small amount to the application size (only relevant for serverless/frontend).

---

## 2. Background Job Processing: BullMQ

### Why it was selected
As mentioned in the event architecture, BullMQ (built on Redis) is our choice for background jobs. It's the most robust and feature-rich job queue library for the Node.js ecosystem, supporting everything Tanweer needs: retries, cron jobs, delayed tasks, and parent-child dependencies.

### Alternatives considered
*   **Agenda:** MongoDB-based. Not suitable as we are using PostgreSQL and Redis.
*   **Bee-Queue:** Faster for simple tasks but lacks the advanced features (retries, groups, dependencies) of BullMQ.

### Pros and Cons
**Pros:**
*   **Reliability:** Jobs are not lost on server crashes (persistence in Redis).
*   **UI:** Compatible with `BullBoard` for visual monitoring of queues.
*   **Scaling:** Easy to add worker nodes as load increases.

**Cons:**
*   **Redis Dependency:** Requires a high-availability Redis instance.

---

## 3. Logging Strategy: Pino + NestJS Logger

### Why it was selected
Pino is a "very low overhead" JSON logger for Node.js. In a SaaS platform like Tanweer, logging in JSON format is mandatory for integration with modern log aggregation tools (ELK Stack, Datadog, CloudWatch). NestJS's built-in Logger will be wrapped around Pino to provide a consistent interface throughout the app.

### Alternatives considered
*   **Winston:** The "standard" logger for many years. It is extremely flexible but significantly slower and more "heavy" than Pino.
*   **Console.log:** Absolutely unsuitable for production due to performance impact (it's synchronous) and lack of structure.

### Pros and Cons
**Pros:**
*   **Speed:** One of the fastest loggers available.
*   **Structured Logging:** Outputs JSON, making searching and filtering in log aggregators easy.
*   **Eco-friendly:** Minimal CPU and memory overhead.

**Cons:**
*   **Readable format:** Requires a "pretty" printer (like `pino-pretty`) for local development, as raw JSON is hard for humans to read in real-time.
