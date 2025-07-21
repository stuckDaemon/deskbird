# Backend

This folder contains the backend API for the Deskbird Staff Engineer challenge.

Built with **NestJS, Sequelize, Postgres**, following modern architecture and authentication patterns.

---

## 📋 Design highlights

### ORM choice
Sequelize selected for explicit control over migrations and runtime behavior.

---

### Schema migrations
- All schema changes tracked via `sequelize-cli`.
- Auto `sequelize.sync()` used for this scoped project to simplify startup and seeding (not recommended for production).

---

### Metadata column on `SequelizeMeta`
Custom migration adds `executed_at` timestamp column for tracking when migrations were applied — useful for audits.

---

### Indexing strategy
- `users.email` column has a `unique: true` constraint, creating an implicit unique index.
- No redundant indexes added intentionally to keep schema lean.

---

### UUID primary keys
- `users.id` is UUID (`uuid_generate_v4()`).
- Postgres `uuid-ossp` extension enabled via migration.

---

## 🔒 Auth approach

- JWT-based auth (`HS256`, 1-hour expiry).
- bcrypt for password hashing.
- Role-based authorization (`@Roles()` decorator + `RolesGuard`).

---

## 📝 JWT expiry decision

Why 1 hour?
- Balance security and session longevity.
- Production would include refresh tokens and short-lived access tokens for better security posture.

---

## 🔨 Database seeding

Reusable script:

```sh
yarn seed ./assets/users.csv
````

Behavior:

* Ensures DB schema sync before insert.
* Accepts CSV with `email`, `password`, `role`.
* Skips duplicate emails.
* Hashes passwords securely.

---

## 🔄 Auth workflow diagram

![auth-diagram.png](assets/auth-diagram.png)

---