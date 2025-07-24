# Deskbird— StaffEngineer Technical Challenge

## 📋Overview

This repository contains my end‑to‑end solution for Deskbird’s Staff Engineer exercise.
It demonstrates a production‑ready, full‑stack web application with:

| Layer              | Technology                                                                | Rationale                                                                                          |
| ------------------ | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| **Frontend**       | Angular20 & PrimeNG20                                                   | Mature component ecosystem, straightforward accessibility compliance, predictable release cadence. |
| **Backend**        | NestJS, TypeScript                                                        | Modular architecture, first‑class testing support, familiar to the current Deskbird stack.         |
| **Database**       | PostgreSQL (Supabase in prod, Docker Compose locally)                     | SQL features without licensing overhead.                                                           |
| **Auth**           | JWT(HS256) + bcrypt                                                      | Industry‑standard stateless sessions, minimal token footprint.                                     |
| **RBAC**           | `admin`, `user` roles enforced in backend guards and Angular route guards | Single source of truth for privileges across tiers.                                                |
| **Infrastructure** | Two deployment paths—**rapid MVP** and **Pulumi IaC**—detailed below      | Allows immediate value delivery while preserving a clean migration story.                          |

---

## 🧭Architecture & Design Decisions

### Backend

* **NestJS modules** isolate domains (auth, user, seed) for testability.
* **Database migrations** via `sequelize-cli`; checked into VCS for auditability.
* **Password hashing** with bcrypt (`saltRounds = 10`).
* **JWT tokens** carry only `sub` and `role`, expire after 1hour; refresh workflow queued (see *Next Steps*).
* **Centralised RBAC**: custom `@Roles()` decorator + `RolesGuard` to prevent drift.

### Frontend

* **Angular20** workspace using SCSS.
* **PrimeNG20** for datatable, dialog, and form components—consistent UX without custom CSS debt.
* **Route guards** mirror backend RBAC.
* **Prettier+ESLint** provide deterministic formatting and CI‑ready linting.

### Infrastructure

Two execution modes exist by design:

| Mode                         | Stack                                                                                             | When to use                                        | Why it exists                                                    |
| ---------------------------- | ------------------------------------------------------------------------------------------------- | -------------------------------------------------- | ---------------------------------------------------------------- |
| **Rapid MVP (current prod)** | • S3 static‑website hosting (frontend)  • Single EC2 instance (API)  • Supabase Postgres (DB)     | Demos, feature spikes, cost‑sensitive early stages | Deploys in minutes, minimal AWS footprint, trivial rollback.     |
| **Pulumi IaC (staged)**      | • ECSFargate (API)  • RDSPostgres  • S3 + CloudFront (frontend)  • ALB+WAF  • Secrets Manager | Stable, scalable production                        | Declarative, reproducible, one‑command environment provisioning. |

Pulumi code is drafted but intentionally not merged yet; parameters for all AWS resources are documented, so codification is a mechanical task rather than discovery work.

---

## 🚀Deployment Options

### 1️⃣Local Development

**Prerequisites**

* Docker & Docker Compose
* Node.js22.15.0 (enforced via `.nvmrc`)

```bash
nvm use
docker-compose up -d         # starts Postgres
# Backend
cd backend && yarn install && yarn start
# Frontend
cd ../frontend && yarn install && yarn start
```

Access the SPA at `http://localhost:4200` (default Angular port).

### 2️⃣AWS Rapid MVP (current)

| Layer    | URL                                                                                                                |
| -------- | ------------------------------------------------------------------------------------------------------------------ |
| Frontend | [http://deskbird-app.s3-website-us-east-1.amazonaws.com/](http://deskbird-app.s3-website-us-east-1.amazonaws.com/) |
| API      | [http://ec2-13-221-134-192.compute-1.amazonaws.com:3000](http://ec2-13-221-134-192.compute-1.amazonaws.com:3000)   |
| Database | `postgresql://postgres:deskbird@db.linrpsbcjfotzyliabgi.supabase.co:5432/postgres`                                 |

If any endpoint is unreachable, notify the maintainer for immediate investigation.

### 3️⃣Pulumi‑based Deployment (ready for promotion)

```bash
cd infra
yarn install
pulumi stack init dev
pulumi config set aws:region eu-central-1
pulumi up
```

Requires AWS credentials configured in your shell.

---

## 🔒Authentication & Authorization

| Concern              | Implementation                                                            |
| -------------------- | ------------------------------------------------------------------------- |
| **Token**            | JWT(HS256), 1‑hour TTL                                                   |
| **Refresh**          | Planned (see *Next Steps*)                                                |
| **Password storage** | bcrypt with per‑password salt                                             |
| **RBAC enforcement** | Backend `RolesGuard`; Angular route guards; shared enum prevents mismatch |

No public user‑creation endpoint is exposed. Accounts are seeded intentionally to block unsolicited registrations and simplify GDPR/CCPA scope at this stage.

---

## 🔨Database Initialisation & Seeding

Schema auto‑sync is enabled **only** for this scoped challenge.

Run:

```bash
yarn seed ./assets/users.csv
```

Columns: `email`, `password`, `role`.
Duplicates are skipped; passwords are hashed before insertion.

---

## 📑Current State & Known Gaps

| Area                   | Status                                                 | Mitigation                                                               |
| ---------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------ |
| **Pulumi stack**       | Templates drafted, not merged                          | All resource parameters captured; codification is straightforward.       |
| **Table auto‑refresh** | Backend returns updated row, UI requires manual reload | SWR polling or WebSocket channel planned.                                |
| **Token rotation**     | No refresh token yet                                   | Short‑lived JWT limits exposure; backend scaffolding for refresh exists. |
| **.env in VCS**        | Committed intentionally                                | Rotate secrets before promotion; no sensitive production keys stored.    |

---

## 🗺️Next Steps

1. **Refresh‑token flow (backend)**

  * Add `/auth/refresh` endpoint, rotate signing keys periodically.
2. **Session rehydration (frontend)**

  * Store refresh token in HttpOnly cookie; implement silent renewal.
3. **Live data updates (frontend)**

  * Introduce WebSocket channel or SWR strategy to remove manual reloads.
4. **Pulumi Infrastructure as Code**

  * Finalise stack: VPC, ALB, ECS/Fargate, RDS, CloudFront, WAF, Secrets Manager.
5. **Observability baseline**

  * Structured logging (pino), OpenTelemetry traces, Prometheus metrics with basic SLO dashboards.
6. **Feature flag service**

  * Integrate ConfigCat or LaunchDarkly for safe, incremental rollouts.

---

## 🤖AI Assistance Disclosure

AI tools (ChatGPT) were used for:

* Architectural research
* Boilerplate generation
* README drafting and refinement

All code paths and decisions were reviewed manually.
