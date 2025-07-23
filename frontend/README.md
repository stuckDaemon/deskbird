# Frontend Overview

This Angular frontend is built with scalability and maintainability in mind. Below are the key implementation choices and architectural decisions.

---

## Auth Service

Authentication is handled by a dedicated `AuthService` that:

- Sends login requests and stores the JWT token
- Decodes the token to extract user info
- Tracks login state reactively using `BehaviorSubject`
- Handles token expiration logic on the client side

We centralize login error handling in the service, so components don't have to deal with raw `HttpErrorResponse`.

---

## Role-Based Access (Edit Permissions)

Editing users is restricted by role. This is enforced both:

- **On the frontend**, by conditionally disabling the "Edit" button if the role is not `'user'`
- **On the backend**, by checking the logged-in user's role server-side

This ensures UI consistency while keeping the backend as the source of truth for authorization.

---

## User Table

We use `p-table` from PrimeNG with:

- Lazy loading (pagination handled server-side)
- Stripe styling and gridlines for clarity
- Conditional rendering of action buttons based on role

Pagination is managed via the `loadUsersLazy()` method, which calculates offset and limit and fetches the correct slice of data.

---

## Component Structure

We try to keep things modular and composable:

- `<app-topbar>` handles navigation
- The user list is a standalone component that interacts with the API layer
- Modals (e.g. Edit User) are kept clean, use `p-dialog`, and align visually with the login form

---

## API Calls (Centralized)

All HTTP requests go through a custom `ApiService` that:

- Automatically prepends the `apiUrl`
- Handles error mapping centrally
- Exposes clean methods: `get`, `post`, `put`, `delete`
- Returns typed observables

No need to repeat error logic or base URLs in components.

---

## Auth Interceptor

We use an HTTP interceptor to attach the auth token to every request automatically. This keeps services clean and avoids repetition. It grabs the token from the `session.util` helpers.

---

## Session Service

Session logic (token and user handling) is abstracted into a simple `session.util.ts`:

- `setToken`, `getToken`, `clearToken`
- `setUser`, `getUser`, `clearUser`

This avoids any tight coupling between storage and logic, and lets us mock/replace session behavior if needed later.

---

## Final Notes

The focus so far has been on:

- Keeping code readable and predictable
- Separating responsibilities (auth, API, view logic)
- Building only what’s needed, while laying a foundation to scale

There’s still room to improve — global error toasts, guards per route, or auto-refresh tokens — but for now, the app is lean, secure, and works.

