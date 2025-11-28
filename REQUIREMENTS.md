# Evidence of Requirements – DevOps Task Tracker (CSC3131)

This file maps the coursework requirements to concrete evidence in my repository, with links to visuals, rationale for each choice, and notes on how someone else could continue the work.

---

## A Server (web stack)

- **Location in repo**
  - `src/server.js`
  - `src/routes/tasks.js`
- **Visuals**
  - (`docs/figure1-tasks-ui.png`) – DevOps Task Tracker tasks UI  
  - (`docs/figure2-architecture.png`) – High-level architecture (browser → Node.js/Express → SQLite)
- **Rationale**
  - I chose **Node.js with Express** because it matches the module practicals, has excellent documentation, and makes it easy to build a small HTTP API plus server-rendered pages in one codebase.
  - The server listens on port **3000** in all environments (local, Docker, Azure), which keeps configuration simple and avoids confusion.
- **Context (handover)**
  - A future developer can add new routes in `src/routes/tasks.js` and mount them in `src/server.js`.
  - If they wanted a separate API layer, they could add a `/api` router alongside the existing `/tasks` routes without changing the overall structure.

---

## A Database

- **Location in repo**
  - `src/db.js` – database connection, table creation, and queries
  - `devops_task_tracker.db` – SQLite file (ignored by Git in `.gitignore`)
- **Visuals**
  - (`docs/figure2-architecture.png`) – architecture diagram showing the data layer
- **Rationale**
  - I used **SQLite (better-sqlite3)** because it is lightweight, requires no separate database server, and fits the scope of a single-user coursework project.
  - This avoids extra Azure cost/complexity while still demonstrating a real persistence layer and SQL queries.
- **Context (handover)**
  - To migrate to a cloud database (e.g. Azure SQL or Postgres), another developer could replace the code in `src/db.js` with a different driver, keeping the rest of the app unchanged.
  - The `tasks` table definition in `src/db.js` documents the schema that would need to be recreated.

---

## Web Frameworks

- **Location in repo**
  - `src/server.js` – Express app and middleware
  - `src/routes/tasks.js` – Express router for task CRUD
  - `src/views/tasks/index.ejs`, `new.ejs`, `edit.ejs` – EJS views
- **Visuals**
  - (`docs/figure1-tasks-ui.png`) – tasks list rendered via EJS
- **Rationale**
  - I chose **Express** as the HTTP framework because it is minimal and familiar from the practicals.
  - I used **EJS** for server-side rendering to keep everything in one repo and avoid adding a separate front-end build toolchain.
- **Context (handover)**
  - New UI pages can be added by creating more `.ejs` templates under `src/views` and adding matching routes.
  - If a future developer wanted a SPA (e.g. React), they could replace the EJS views with an API-only Express server and a separate front-end client.

---

## Continuous Integration

- **Location in repo**
  - `.github/workflows/ci.yml` – GitHub Actions workflow
- **Visuals**
  - (`docs/figure3-github-actions.png`) – GitHub Actions run showing all CI steps green
- **Rationale**
  - The pipeline runs on every push/PR to `main`, installs dependencies, runs **Jest tests**, and **builds the Docker image**.
  - This gives early feedback if tests fail or if the Dockerfile stops building, which aligns with CI principles.
- **Context (handover)**
  - A future engineer can add extra steps (e.g. linting or security scans) by extending `ci.yml`.
  - To enable CD later, they could add a job that pushes the image to Docker Hub and triggers a deployment to Azure.

---

## Deployment

- **Location in repo**
  - `Dockerfile` – build instructions for the app container
  - `docker-compose.yml` – local Docker Compose configuration
- **Visuals**
  - (`docs/figure4-dockerhub.png`) – Docker Hub repository for `ayoubaldawood/devops-task-tracker`
  - (`docs/figure5-azure-overview.png`) – Azure Web App overview (configured for the container image)
  - (`docs/figure6-azure-tasks.png`) – DevOps Task Tracker running on Azure over HTTPS
- **Rationale**
  - The app is containerised so the **same image** runs locally, in CI, and on Azure, reducing configuration drift.
  - Azure App Service (Linux Web App for Containers) was chosen because it is provided in the module subscription and supports direct deployment from Docker Hub.
- **Context (handover)**
  - To change registry or image name, update the image tag in Azure’s container settings and in any future CD pipeline.
  - Docker Compose can be extended with more services (e.g. reverse proxy, separate database) without changing the application code.

---

## Maintainability

- **Location in repo**
  - `src/` – all application code (server, routes, DB, logging)
  - `src/logger.js` – Winston logging configuration
  - `README.md` – project overview and run instructions
  - `REQUIREMENTS.md` – this mapping file
- **Visuals**
  - (`docs/figure2-architecture.png`) – architecture diagram highlighting separation of concerns
- **Rationale**
  - The codebase is split into small modules: `server.js` (entry point), `routes/tasks.js` (routing + SQL calls), `db.js` (database), `logger.js` (logging).
  - The README explains how to run the app locally, with Docker, and where the health check lives.
- **Context (handover)**
  - Another developer can quickly find the entry point and main responsibilities by reading `README.md` and browsing `src/`.
  - New features (e.g. more task fields or extra pages) can be added without restructuring the entire project.

---

## Scalability

- **Location in repo**
  - `Dockerfile`
  - `docker-compose.yml`
- **Visuals**
  - (`docs/figure2-architecture.png`) – single-container architecture (suitable for horizontal scaling in future)
- **Rationale**
  - The current system runs as a single container, which is enough for this coursework, but the container boundary makes it easier to scale out later behind a load balancer.
  - SQLite is a constraint for scaling because it stores data on a single file; this is acceptable for a coursework demo but not for a high-traffic production system.
- **Context (handover)**
  - To truly scale, a future engineer would:
    - Move from SQLite to an external managed database (e.g. Azure Database for PostgreSQL).
    - Put the app container behind a reverse proxy/load balancer (e.g. Nginx) and run multiple instances.
  - The existing Docker setup is a starting point that can be extended to that architecture.

---

## Observability

- **Location in repo**
  - `src/logger.js`
  - `logs/app.log` (created at runtime; folder committed, log file git-ignored)
  - `src/server.js` – `GET /health` endpoint
- **Visuals**
  - (`docs/figure7-logs-app.png`) – `logs/app.log` in VS Code showing timestamped HTTP and task events
  - (`docs/figure8-health-endpoint.png`) – `/health` endpoint JSON response in the browser
- **Rationale**
  - I used **Winston** for structured logging, writing to both console and a file so logs are available in Docker, Azure logs, and on the local filesystem.
  - The `/health` endpoint provides a simple automated check for uptime that can be hit by monitoring tools or curl.
- **Context (handover)**
  - A future developer could ship `app.log` to a central system (e.g. ELK, Grafana Loki) using a sidecar or agent.
  - Additional health/metrics endpoints could be added (e.g. `/metrics` for Prometheus) using the same pattern.

---

## Security

- **Location in repo**
  - `src/server.js` – basic HTTP configuration
  - Azure Web App configuration – TLS termination (managed by Azure)
- **Visuals**
  - (`docs/figure6-azure-tasks.png`)– App running over **HTTPS** on Azure
- **Rationale**
  - For this coursework scope there is **no authentication/authorisation**, but the app is served over HTTPS when deployed to Azure, so traffic is encrypted in transit.
  - I avoided logging any sensitive user data in `app.log` and kept the SQLite database file out of version control.
- **Context (handover)**
  - To harden the system, a future engineer could:
    - Add authentication/authorisation (e.g. Azure AD or a simple login system).
    - Move secrets/configuration into environment variables or Azure Key Vault.
    - Add security-focused checks to the CI pipeline (dependency scanning, npm audit, etc.).
