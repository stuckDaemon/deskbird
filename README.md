# Deskbird Staff Engineer Technical Challenge

## 📋 Overview

This repository contains my implementation of the Deskbird Staff Engineer technical challenge.  
It demonstrates a full-stack web application with:

- **Frontend:** Angular 20 + PrimeNG 20
- **Backend:** NestJS + Postgres
- **Auth:** JWT-based authentication with bcrypt password hashing
- **RBAC:** Role-based access control for `admin` and `user` roles
- **Infrastructure:** Docker Compose for local dev, Pulumi on AWS for deployable demo

---

## 🧭 Architecture & Design Decisions

### Backend
- **NestJS modular architecture** for separation of concerns and extensibility.
- **Database:** Postgres with seeded admin user at initialization.
- **Authentication:** 
  - JWT tokens (`HS256` signing)
  - Minimal payload: `sub` (user id), `role`, `exp` (expiry)
  - Password hashing with `bcrypt`
- **Authorization:** 
  - Centralized RBAC with custom `@Roles()` decorator and `RolesGuard`.
  - No scattered `if user.role` checks — all at controller layer.

### Frontend
- **Angular 20 project scaffold** with SCSS styling and routing enabled.
- **PrimeNG 20:** for fast UI component library.
- **Routing:** Auth guard protects all post-login routes.
- **Role-based UI:** Admins can edit users; regular users see read-only list.
- **Prettier + ESLint:** enforced formatting and linting consistency.

### Infrastructure
- **Docker Compose:** For easy local dev spin-up with API + Postgres.
- **Pulumi (optional but included):** Declarative, reproducible AWS deployment:
    - Backend API on ECS Fargate
    - RDS Postgres (free tier where possible)
    - Frontend hosted on S3 + CloudFront
    - Secrets/config managed securely via Pulumi config

---

## 🚀 Deployment Options

### 1️⃣ Local Development

#### Requirements:
- Docker
- Docker Compose
- Node.js `22.15.0` (enforced via `.nvmrc` for consistency)

#### Steps:
```sh
nvm use
docker-compose up
````

Access frontend at `http://localhost:<port>`.

---

### 2️⃣ AWS Live Demo Deployment

The project can be fully deployed to AWS using Pulumi.

#### Example setup:

```sh
cd infra
yarn install
pulumi stack init dev
pulumi config set aws:region eu-central-1
pulumi up
```

#### Notes:

* AWS credentials must be configured locally before deployment.
* Infra-as-code enables easy reproducibility in any AWS account.

---

## 🔒 Authentication & Authorization Approach

* **JWT-based auth:**

  * Secure, minimal tokens
  * Proper expiry handling (`exp` claim)
  * Signed with strong secret (from environment/config)

* **RBAC:**

  * Roles enforced via `@Roles()` decorator + centralized `RolesGuard`.
  * Admin and regular user clearly separated.
  * Backend always validates roles — UI only reflects state for usability, not security.

* **Password storage:** bcrypt hashed, salted by default.

---

## ⚠️ Common mistakes explicitly avoided

* No plaintext password storage
* No sensitive user info inside JWT
* No role-check logic scattered in service layers
* No frontend-only access control: backend guards are primary
* ESLint + Prettier integrated for consistent formatting and linting
* Modern Node.js (`22.15.0`) for compatibility with PrimeNG 20 and Angular 20

---

## 🔔 Next steps / production-ready improvements

If this were a production system:

* Add refresh token support and short-lived access tokens.
* Rate limit login endpoint to mitigate brute force.
* Enable MFA for sensitive operations.
* Audit logs for admin changes.
* Enterprise SSO integration (e.g., Auth0, AWS Cognito).
* Database-level encryption for sensitive fields (e.g., `pgcrypto` extension).

---

## 📦 Project structure

```
.
├── .nvmrc                 # Node.js version: 22.15.0
├── backend/               # NestJS API
├── frontend/              # Angular 20 app
├── infra/                 # Pulumi AWS infra-as-code
├── docker-compose.yml     # Local dev runner
├── README.md
└── .prettierrc / .prettierignore / ESLint config (per project)
```

---

## 📝 Reviewer notes

* Code quality, clarity, and structure prioritized over UI polish.
* Comments included where shortcuts taken intentionally.
* `infra/` is designed to allow easy AWS deployment with Pulumi + AWS credentials.
* `.nvmrc` included to ensure consistent dev environment (Node.js `22.15.0`).


### Database seeding

The backend project includes a reusable NestJS-aware seed script.

Usage:

```
yarn seed ./users.csv

```

This script:
- Bootstraps the full NestJS DI system (via `NestFactory.createApplicationContext`)
- Parses a CSV of users (`email`, `password`, `role`)
- Invokes `UsersService` to create users with proper bcrypt password hashing
- Skips users that already exist (by email)

