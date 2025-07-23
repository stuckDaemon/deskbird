# Deskbird Staff Engineer Technical Challenge

## 📋 Overview

This repository contains my implementation of the Deskbird Staff Engineer technical challenge.

It demonstrates a full-stack web application with:

- **Frontend:** Angular 20 + PrimeNG 20
- **Backend:** NestJS + Postgres
- **Auth:** JWT-based authentication with bcrypt password hashing
- **RBAC:** Role-based access control for `admin` and `user` roles
- **Infrastructure:** Docker Compose for local development and Pulumi for reproducible AWS deployment.

---

## 🧭 Architecture & Design Decisions

### Backend
- **NestJS modular architecture** for clear separation of concerns.
- **Database:** Postgres, with schema migrations tracked via `sequelize-cli`.
- **Password hashing:** bcrypt with `saltRounds = 10`.
- **JWT-based authentication:** `HS256` signing, minimal payload (`sub`, `role`), 1-hour expiry.
- **Role-based access control:** centralized `@Roles()` decorator and `RolesGuard`.

### Frontend
- **Angular 20 scaffold:** SCSS styling and routing enabled.
- **PrimeNG 20:** fast UI component library integration.
- **Prettier + ESLint:** consistent formatting and linting applied.

### Infrastructure
- **Docker Compose:** quick local development environment.
- **Pulumi:** declarative, reproducible AWS deployment:
  - API on ECS Fargate
  - RDS Postgres (free tier compatible)
  - S3 + CloudFront hosting for frontend
  - Config and secrets handled securely via Pulumi.

---

## 🚀 Deployment Options

### 1️⃣ Local development

#### Requirements:
- Docker
- Docker Compose
- Node.js `22.15.0` (enforced via `.nvmrc` for consistency)

#### Quick start:
```sh
nvm use
docker-compose up
````

Access frontend at `http://localhost:<port>`.

---

### 2️⃣ AWS deployment (optional)

Pulumi stack included for fully automated deployment to AWS:

```sh
cd infra
yarn install
pulumi stack init dev
pulumi config set aws:region eu-central-1
pulumi up
```

AWS credentials must be pre-configured locally.

---

## 🔒 Authentication & Authorization Approach

* **JWT tokens:** secure, signed, minimal claims (`sub`, `role`).
* **RBAC:** enforced using custom decorator + centralized `RolesGuard`.
* **Password storage:** bcrypt hashed with salt embedded (industry standard).

---

## 📝 Reviewer notes

* Code quality and structure prioritized over UI polish.
* Clear separation of backend/frontend/infra code.
* `.nvmrc` included for consistent dev environment.

---

## 🔨 Database initialization & seeding

Schema auto-sync on startup (`sequelize.sync()`) for this scoped challenge.

Reusable seed script included:

```sh
yarn seed ./assets/users.csv
```

Details:

* Syncs schema before inserting records.
* Accepts `email`, `password`, `role` columns.
* Hashes passwords securely with bcrypt.
* Skips duplicates and logs meaningful output.

---

## 🤖 AI assistance disclosure

AI tools (primarily ChatGPT) were used as a productivity assistant:

* Planning and architectural guidance
* Feedback on design tradeoffs
* Researching best practices
* Boilerplate scaffolding (including README)
* Scaffolding unit tests (`AuthService` and `RolesGuard`)

All final code and decisions were reviewed and refined intentionally by me.

---