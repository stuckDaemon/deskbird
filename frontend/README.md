# Frontend— Angular20 Overview

## 📋Purpose

The Angular application delivers Deskbird’s user interface. Design choices emphasise modularity, testability, and straightforward extensibility.

---

## 🗺️Key Components & Responsibilities

| Concern                | Implementation                                          | Rationale                                                                                           |
| ---------------------- | ------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| **Authentication**     | `AuthService` + HTTPinterceptor                        | Centralises login, JWT storage, and token attachment; keeps components stateless.                   |
| **Session management** | `session.util.ts` helpers (`setToken`, `getUser`, etc.) | Abstracts storage, simplifies mocking, avoids direct `localStorage` calls across codebase.          |
| **Role‑based access**  | Angular route guards + conditional UI controls          | Mirrors backend RBAC; disables forbidden actions client‑side while backend remains source of truth. |
| **API communication**  | `ApiService` (`get`, `post`, `put`, `delete`)           | Single point to prepend `apiUrl`, map errors, and return typed `Observable`s.                       |
| **Data grid**          | PrimeNG`p-table` with server‑side pagination           | Minimises bundle size, supports lazy loading for large datasets, consistent UI styling.             |

---

## 🔐Authentication Flow

1. **Login request** sent via `AuthService.login()`.
2. JWT stored securely by `session.util.setToken()`.
3. HTTP interceptor appends `Authorization: Bearer <token>` to subsequent requests.
4. `AuthService` exposes reactive auth state through a `BehaviorSubject`, enabling real‑time UI updates.
5. Client‑side token expiry detection triggers `AuthService.logout()`; refresh workflow queued (*see Next Steps*).

---

## 🧩Component Topology

```text
app/
├── core/                    # singleton services & interceptors
│   ├── auth/                # AuthService, AuthInterceptor
│   ├── api/                 # ApiService
│   └── session/             # session.util.ts
├── shared/                  # reusable UI components
├── features/
│   └── users/               # user-table, edit-user-dialog
└── layout/
    └── topbar/              # app-topbar component
```

* Each feature module owns its routing configuration.
* Dialogs (`p-dialog`) are self‑contained, share styles with login for visual coherence.

---

## 📊User Table Highlights

| Capability              | Detail                                                           |
| ----------------------- | ---------------------------------------------------------------- |
| **Lazy loading**        | `loadUsersLazy()` computes offset/limit and requests paged data. |
| **Conditional actions** | “Edit” button rendered only for authorised roles.                |
| **Styling**             | Stripe rows and gridlines via PrimeNG theming for readability.   |

---

## 🔨Build & Deploy

```bash
ng build --configuration production
aws s3 sync ./dist/deskbird/browser s3://deskbird-app/ --delete
```

* Builds optimised bundle (`--configuration production`).
* Synchronises artefacts to the S3 bucket powering the CloudFront distribution.
* AWS CLI must be configured with write access to `deskbird-app`.

---

## 🗺️Next Steps

1. **Silent token refresh**
   Implement refresh‑token flow and interceptor logic to renew sessions automatically.
2. **Global error handling**
   Central toast service for consistent UX on HTTP failures.
3. **Per‑route guards**
   Granular protection beyond component‑level checks.
4. **Real‑time grid updates**
   Integrate WebSocket channel or SWR polling to reflect backend writes without manual reload.

---

The frontend currently prioritises clarity, responsibility segregation, and a lean surface area while providing a foundation for rapid feature growth.
