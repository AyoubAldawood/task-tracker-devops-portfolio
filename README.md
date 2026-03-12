# DevOps Task Tracker – CSC3131 Portfolio

This repository contains my individual portfolio project for **CSC3131 – Development and Operations of Systems**.

The application is a simple **DevOps Task Tracker** built with **Node.js, Express, EJS and SQLite**. It is used as a vehicle to demonstrate DevOps practices such as containerisation, deployment to Azure, logging, monitoring/health checks and Continuous Integration.

> Note: This was originally developed and first published in the “Newcastle University Computing” GitHub organisation as part of the CSC3131 module. A public copy has then been published on my GitHub here.

---

## Project Outputs

- [Read Project Report](./DevOps-Report.pdf)

---

## Features

- Create, view, update and delete tasks (CRUD)
- Tasks stored in a local **SQLite** database
- Server-side rendering using **EJS** templates
- **Health check endpoint** at `/health`
- **Structured logging** with Winston (console + `logs/app.log`)
- **Docker** and **docker-compose** configuration
- Deployment to **Azure App Service (Linux Web App for Containers)**
- **GitHub Actions CI** workflow:
  - installs dependencies
  - runs Jest tests
  - builds the Docker image

---

## Tech Stack

- Node.js 18  
- Express  
- EJS  
- SQLite (better-sqlite3)  
- Winston (logging)  
- Docker & Docker Compose  
- Azure Web App for Containers  
- GitHub Actions (CI)  
- Jest + Supertest (tests)

---

## Running the app locally

```bash
# Install dependencies
npm install

# Start in development mode (with nodemon)
npm run dev
```

Then visit:
- `http://localhost:3000/` – redirects to `/tasks` 
- `http://localhost:3000/tasks` – main UI 
- `http://localhost:3000/health` – JSON health check

---

## Running with Docker
Build and run the container directly:

```bash
# Build the image
docker build -t devops-task-tracker .

# Run the container
docker run --rm -p 3000:3000 devops-task-tracker

# Or using docker-compose:
docker compose up --build
```

**This will:**

- Run the app on port **3000**
- Bind-mount `devops_task_tracker.db` so the SQLite data persists
- Bind-mount `logs/` so `logs/app.log` is available on the host

---

## Tests

The project includes a basic Jest test for the `/health` endpoint.

```bash
npm test
```

GitHub Actions runs the same tests on every push or pull request to the main branch.

---

## Deployment 

The Docker image is pushed to Docker Hub and deployed to Azure App Service (Linux Web App for Containers) using the public image:

- ayoubaldawood/devops-task-tracker:latest

The Azure Web App pulls this container image and exposes the application over HTTPS.

---

## Requirements mapping

Evidence for how this repository meets the CSC3131 coursework requirements is documented in:

- `REQUIREMENTS.md`
