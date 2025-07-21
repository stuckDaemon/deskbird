# Backend

This folder contains the backend API built with NestJS, Sequelize, and Postgres.

---

## 📋 Design decisions

### Sequelize ORM choice
I chose Sequelize over TypeORM for explicit control and cleaner separation of migrations, models, and runtime behavior.

---

### Migrations

- All schema changes are tracked using `sequelize-cli` migrations.
- `synchronize` is explicitly disabled in the Sequelize config to ensure migrations remain the single source of truth for schema management.

---

### Metadata column on `SequelizeMeta`

A custom migration adds an additional `executed_at` column to the `SequelizeMeta` table.

This column records the timestamp when each migration was applied, enabling better operational observability.

Example:
```sql
SELECT * FROM "SequelizeMeta";
````

This allows tracking not just *which migrations ran* but also *when* they ran — useful for debugging and audit trails.

---

### Indexing

* No explicit additional index was created on the `users.email` column.
* The `users.email` column has a `unique: true` constraint, which **implicitly creates a unique index in Postgres**.

👉 **Rationale:**
At this stage, we keep the schema lean and avoid redundant indexes.
Future indexing decisions should be driven by actual query patterns and performance profiling.

---

### UUID primary keys

* The `users.id` column is a UUID primary key.
* We enabled the Postgres `uuid-ossp` extension explicitly via a migration to ensure consistent UUID generation using `uuid_generate_v4()`.

---

## 📦 Structure overview

```
src/
  ├── app.module.ts
  ├── users/
  ├── auth/
  ├── scripts/
  └── main.ts
```

---

## 🔒 Authentication and authorization

* JWT-based auth with bcrypt password hashing.
* Role-based access control (RBAC) via `@Roles()` decorator and `RolesGuard`.

---

## 🔒 JWT expiration policy

This implementation sets the access token expiration to 1 hour (`expiresIn: '1h'`), balancing session longevity with reduced risk if a token leaks.

### Why 1 hour?
- A short-lived token reduces the impact of token compromise.
- It aligns with common best practices for stateless APIs.

### Production considerations
In a production system, I would implement a refresh token strategy:
- Access tokens would expire in 15–30 minutes.
- Refresh tokens would enable re-authentication without requiring the user to log in again.
- Refresh tokens would be securely stored (HTTP-only cookies) and rotated to prevent replay attacks.

Additionally:
- Admin or privileged sessions would require MFA.
- Tokens would be auditable, with suspicious patterns monitored and revoked if needed.

---

## 📝 Notes

This backend API is fully decoupled from environment configuration via `.env` variables and works out of the box with Docker Compose for local development.


---

## 🔄 Auth workflow diagram
![auth-diagram.png](assets/auth-diagram.png)
