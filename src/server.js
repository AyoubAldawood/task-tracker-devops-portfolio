const express = require("express");
const path = require("path");
const logger = require("./logger");


const app = express();
const PORT = process.env.PORT || 3000;

// Set EJS as the view engine 
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Handle form data 
app.use(express.urlencoded({ extended: true }));

// Simple request logging middleware
app.use((req, res, next) => {
  logger.info(`${req.method} ${req.url}`);
  next();
});

// Simple health check endpoint
app.get("/health", (req, res) => {
  const healthInfo = {
    status: "ok",
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
  };

  logger.info(`Health check accessed: ${JSON.stringify(healthInfo)}`);
  res.status(200).json(healthInfo);
});


// Home route
app.get("/", (req, res) => {
  res.send("DevOps Task Tracker – it works!");
});

// Tasks route
const tasksRouter = require("./routes/tasks");
app.use("/tasks", tasksRouter);

// 404 handler (for routes that don't match anything above)
app.use((req, res, next) => {
  res.status(404);
  logger.warn(`404 Not Found: ${req.method} ${req.url}`);
  res.render("error", { status: 404, message: "Page not found" });
});

// Generic error handler
app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`);
  console.error(err);

  res.status(500);
  res.render("error", { status: 500, message: "Something went wrong." });
});


// Only start the server if this file is run directly (not when required by tests)
if (require.main === module) {
  app.listen(PORT, () => {
    logger.info(`Server running at http://localhost:${PORT}`);
  });
}

// Export the app for testing
module.exports = app;

