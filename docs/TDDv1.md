 Technical Design Document (TDD) — v1

- Project: Kanban To-Do List
- Document Version:** 1.0
- Date:2025-12-22


 1. Goals and Constraints
- Provide a clear, maintainable architecture for the Kanban To-Do List web app.
- Keep the initial deployment simple (single-server Node backend with JSON persistence) and design for incremental improvements.
- Prioritize developer productivity, testability, and safe handling of user data.

2. High-Level Architecture
- Client: React (Vite) single-page app in `client/`.
- Server: Node.js + Express in `server/` exposing RESTful JSON APIs.
- Persistence: v1 uses file-based JSON (`server/data/tasks.json`, `server/data/users.json`). Replaceable with a DB later.
- Communication: HTTPS (or HTTP in dev) JSON API.

Diagram :

Client (browser)
  ↕ HTTPS/JSON
Server (Express)
  ↕ File I/O or DB
Storage (JSON files / DB)

3. Component Design

3.1 Frontend (client/)
- Entry: `src/main.jsx` mounts `App.jsx`.
- `App.jsx`: Routes and `AuthContext` provider.
- Pages in `src/pages/`: `Home`, `Login`, `Register`, `TodoList`.
- State:
  - Local UI state for drag/drop; global auth state in `AuthContext`.
  - Tasks fetched per-user from `/api/tasks` and cached in memory.
- UX:
  - Drag-and-drop using HTML5 Drag API or a lightweight library.
  - Optimistic UI updates on drag with rollback on error.

 3.2 Backend (server/)
- `server.js` exposes endpoints under `/api`.
- Middlewares:
  - JSON body parser
  - CORS (dev only or configured origin)
  - Auth middleware to verify JWT or session cookie
  - Error-handling middleware
- Routes:
  - `POST /api/register` — create user
  - `POST /api/login` — authenticate, return token
  - `GET /api/tasks` — list authenticated user's tasks
  - `POST /api/tasks` — create task
  - `PUT /api/tasks/:id` — update task
  - `DELETE /api/tasks/:id` — delete task
- Services:
  - `authService` — hash passwords, sign/verify tokens
  - `taskService` — CRUD operations, persistent storage adapter
  - `storageAdapter` — file-based adapter implementing read/write plus lock to avoid concurrent writes; DB adapter stub for future

 4. Data Models
- User
  - `id: string` (uuid)
  - `email: string`
  - `passwordHash: string`
  - `createdAt: ISOString`

- Task
  - id: string (uuid)
  - userId: string
  - title: string
  - description?: string
  - status: "All" | "Active" | "Completed"
  - tags: string[]
  - dueDate?: ISOString
  - createdAt: ISOString
  - updatedAt: ISOString

 5. API Contract (examples)
- `POST /api/register` { email, password } → 201 { id, email }
- `POST /api/login` { email, password } → 200 { token }
- `GET /api/tasks` (Authorization: Bearer <token>) → 200 [{task}, ...]
- `POST /api/tasks` { title, ... } → 201 { task }
- `PUT /api/tasks/:id` { title?, status?, ... } → 200 { task }
- `DELETE /api/tasks/:id` → 204
