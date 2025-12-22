# Software Requirements Specification (SRS) — v1

- **Project:** Kanban To-Do List
- **Document Version:** 1.0
- **Date:** 2025-12-15
- 

 1. Purpose
This SRS describes the functional and non-functional requirements for the Kanban To-Do List web application. It is intended for developers, testers, and stakeholders.
 2. Scope
The system is a lightweight kanban-style task manager enabling users to register/login, create and manage tasks on a board with columns (e.g., All, Active, Completed), and persist data via a backend.

3. Definitions, Acronyms, Abbreviations3
- API: Application Programming Interface
- UI: User Interface

 4. Overall Description
Users can sign up, sign in, create tasks (title, description, due date, priority, tags), move tasks between columns, edit/delete tasks, and filter/search tasks. Admin features are out of scope for v1.

 5. Functional Requirements
FR-1: User Registration
- Users can register with email and password.

FR-2: User Authentication
- Users can log in and log out; sessions persisted using JWT or server session.

FR-3: Task CRUD
- Users can create, read, update, and delete tasks. Each task has: id, title, description, status, priority, dueDate, tags, createdAt, updatedAt.
FR-4: Persistence
- Tasks and user data are stored on the server (JSON file or database).

FR-5: Search & Filter
- Users can search by title/description and filter by tag, priority, and due date.

FR-6: Responsive UI
- UI must be usable on desktop and mobile viewport sizes.

 6. Non-Functional Requirements
NFR-1: Performance
- Typical page load under 2s on broadband; board updates locally immediate.

NFR-2: Security
- Passwords must be hashed; authentication endpoints protected.

NFR-3: Reliability
- Data persistence must survive server restarts.

NFR-4: Maintainability
- Code should be modular and documented.

 7. External Interfaces
- REST API endpoints for auth and tasks (e.g., `/api/register`, `/api/login`, `/api/tasks`).
- Frontend communicates via JSON over HTTP(S).

8. Data Requirements
- User: { id, name?, email, passwordHash, createdAt }
- Task: { id, userId, title, description, status, priority, tags[], dueDate, createdAt, updatedAt }

 9. Use Cases (high level)
- UC-1: Register and verify account
- UC-2: Log in and view personal board
- UC-3: Create task and assign to "To Do"
- UC-4: Drag task to "In Progress" and "Done"
- UC-5: Edit task details
- UC-6: Delete task

 10. Acceptance Criteria
- A user can register and log in successfully.
- A logged-in user can create, update, move, and delete tasks and see changes persisted after reload.
- Board layout adapts to mobile and desktop.

 11. Future Enhancements 
- Real-time collaboration (WebSockets)
- Subtasks and checklists
- Reminders and notifications
- User roles and admin panel


