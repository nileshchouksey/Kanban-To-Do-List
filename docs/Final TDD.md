
📘 Technical Design Document (TDD)
Project: TaskWave – Kanban Task Manager
Prepared by: Ramya 
Date: January 2026

1. Introduction
- Purpose: Define the technical architecture, design decisions, and implementation details for TaskWave.
- Scope: Covers frontend, backend, database, APIs, and integration points.
- Audience: Developers, reviewers, testers, and maintainers.

2. System Architecture
2.1 High-Level Architecture
- Frontend: React SPA (JSX, hooks, modular components).
- Backend: Node.js + Express REST API.
- Database: MongoDB Atlas with Mongoose ODM.
- Auth: JWT-based authentication.
- Deployment: Local dev, cloud-hosted backend (Heroku/Render) + Atlas.
2.2 Architecture Diagram
[React Frontend] <--> [Express API] <--> [MongoDB Atlas]
         |                  |
   JWT Auth, UI        Routes, Middleware



3. Data Design
3.1 Database Schema (Mongoose)
const taskSchema = new mongoose.Schema({
  text: { type: String, required: true },
  status: { type: String, enum: ['todo', 'in-progress', 'done'], default: 'todo' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  completed: { type: Boolean, default: false },
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});


3.2 Data Flow
- Frontend → Backend: JSON payloads via fetch/apiRequest.
- Backend → DB: Mongoose queries (find, findByIdAndUpdate, deleteOne).
- Backend → Frontend: Normalized JSON responses (id, status, priority).

4. Component Design
4.1 Frontend Components
- App.jsx: Root, routing, auth context.
- TodoList.jsx: Kanban board, task rendering, move controls.
- TaskCard.jsx: Individual task card with actions.
- TaskForm.jsx: Add/edit task form.
- FilterControls.jsx: Filter (All, Active, Completed), sort dropdown.
4.2 Backend Modules
- server.js: Express app bootstrap.
- routes/tasks.js: CRUD + status endpoints.
- routes/auth.js: Login/logout, JWT issuance.
- models/Task.js: Mongoose schema.
- middleware/auth.js: JWT validation.

5. API Design
 API Design
|Method  | EndPoint         |  Description             |     |Request Body                       |Response           | 

|  GET   | /api/tasks       |   Fetch user tasks       |      -                                  | [Task]            |
|  POST  | /api/tasks       |   Create new task        |    { text, priority }                   | Task              | 
|  PUT   | /api/tasks/:id   |    Update task fields    |  {text?, priority?, status?, completed }| Task              |
|  DELETE| /api/tasks/:id   |    Delete task           |      -                                  | 204               | 
|  DELETE| /api/tasks/clear-
                 completed  |Bulk delete completed     |      -                                  | { deletedCount }  |
                   


6. Status Transition Logic
- Todo → In Progress: changeStatus(id, 'in-progress')
- In Progress → Todo/Done: changeStatus(id, 'todo'/'done')
- Done → In Progress (Reopen): changeStatus(id, 'in-progress')

7. Security Design
- JWT Auth: Required for all task routes.
- Validation: Enforce enums, required fields.
- Sanitization: Escape user input, reject invalid payloads.
- CORS: Allow frontend domain only.

8. Error Handling
- Frontend: Alerts for failed API calls, console logs for debugging.
- Backend: Try/catch wrappers, res.status(400/500).json({ error }).
- DB: Validation errors surfaced to frontend.

9. Testing Strategy (TDD Alignment)
- Unit Tests: normalizeTask, changeStatus, toggleTask.
- Integration Tests: Task routes, schema validation, auth middleware.
- E2E Tests: Add/move/edit/delete tasks, filters, clear completed.
- Regression Tests: Enum consistency (in-progress vs inprogress).

10. Deployment & Maintenance
- Dev: Localhost:8080 frontend, localhost:3000 backend.
- Prod: Cloud-hosted backend + Atlas DB.
- Monitoring: Logs, error tracking (e.g., Sentry).
- Maintenance: Schema migrations, dependency updates, code reviews.


