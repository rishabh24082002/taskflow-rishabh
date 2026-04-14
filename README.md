# TaskFlow Backend

## 1. Overview

TaskFlow is a backend service for managing projects and tasks with authentication, built as a scalable, production-ready system.

### What it does

* User authentication (JWT-based)
* Project management (create, view, update, delete)
* Task management within projects
* Database migrations & seeding

### Tech Stack

* **Backend:** Node.js, Express.js
* **Database:** PostgreSQL
* **ORM/Query Builder:** Knex.js
* **Containerization:** Docker, Docker Compose
* **Auth:** JWT (JSON Web Tokens)

---

## 2. Architecture Decisions

### Structure

* **Layered Architecture**: Routes → Controllers → Services → DB
* Keeps business logic separate from routing logic
* Improves maintainability and testability

### Why PostgreSQL?

* Strong relational integrity
* Better suited for structured data like users, projects, tasks

### Why Knex?

* Lightweight and flexible
* Full control over SQL queries

### Dockerized Setup

* Ensures consistency across environments
* Removes "works on my machine" issues

### Tradeoffs & Shortcuts

* Skipped advanced validation layer (like Joi/Zod) for speed
* Minimal error handling in some areas
* No rate limiting or security hardening (kept simple)

### Intentionally Left Out

* No frontend (backend-focused assignment)
* No caching layer (Redis) to keep setup simple
* No microservices (kept monolithic for clarity)

---

## 3. Running Locally

### Prerequisites

* Docker
* Docker Compose

### Steps

```bash
git clone https://github.com/your-name/taskflow
cd taskflow
cp .env.example .env
```

### IMPORTANT (Database Fix)

Ensure your `.env` contains:

```env
DB_NAME=taskflow_db
POSTGRES_DB=taskflow_db
```

### Start Application

```bash
docker compose up --build
```

### App will be available at:

* Backend: [http://localhost:5000](http://localhost:5000)

---

## 4. Running Migrations

Migrations are automatically executed on container startup.

If you want to run manually:

```bash
docker exec -it taskflow_backend npx knex migrate:latest
docker exec -it taskflow_backend npx knex seed:run
```

---

## 5. Test Credentials

Use the following seeded user:

```
Email:    test@example.com
Password: password123
```

---

## 6. API Reference

### 📬 API Collection

You can import the Postman collection to test all APIs:

👉 [Download Postman Collection](./postman/taskflow-collection.json)

Steps:
1. Open Postman
2. Click **Import**
3. Upload the file
4. Run the **Login** request first to set the token

## 7. What I'd Do With More Time

### Improvements

* Add request validation (Joi/Zod)
* Implement role-based access control (RBAC)
* Write unit & integration tests
* Introduce Redis caching
* Move to microservices if scale demands
* CI/CD pipeline (GitHub Actions)
* Rate limiting


---

## Final Note

This project focuses on clean architecture, scalability, and real-world backend practices while keeping the setup simple and reviewer-friendly.
