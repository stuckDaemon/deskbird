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

## 📝 Notes

This backend API is fully decoupled from environment configuration via `.env` variables and works out of the box with Docker Compose for local development.
