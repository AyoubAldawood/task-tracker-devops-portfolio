const express = require("express");
const router = express.Router();
const db = require("../db");

// List all tasks
router.get("/", (req, res) => {
  const rows = db.prepare("SELECT * FROM tasks ORDER BY created_at DESC").all();
  res.render("tasks/index", { tasks: rows });
});

// Show "New Task" form
router.get("/new", (req, res) => {
  res.render("tasks/new");
});

// Handle form submission to create a task
router.post("/", (req, res) => {
  const { title, description, status } = req.body;

  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, status)
    VALUES (?, ?, ?)
  `);

  stmt.run(title, description, status || "todo");

  res.redirect("/tasks");
});

// Show edit form
router.get("/:id/edit", (req, res) => {
  const id = req.params.id;
  const task = db.prepare("SELECT * FROM tasks WHERE id = ?").get(id);

  if (!task) {
    return res.status(404).send("Task not found");
  }

  res.render("tasks/edit", { task });
});

// Handle updating a task
router.post("/:id", (req, res) => {
  const id = req.params.id;
  const { title, description, status } = req.body;

  db.prepare(`
    UPDATE tasks
    SET title = ?, description = ?, status = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(title, description, status, id);

  res.redirect("/tasks");
});

// Handle deleting a task
router.post("/:id/delete", (req, res) => {
  const id = req.params.id;

  db.prepare("DELETE FROM tasks WHERE id = ?").run(id);

  res.redirect("/tasks");
});

module.exports = router;
