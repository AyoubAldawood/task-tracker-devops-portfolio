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


// Home route
app.get("/", (req, res) => {
  res.send("DevOps Task Tracker – it works!");
});

// Tasks route
const tasksRouter = require("./routes/tasks");
app.use("/tasks", tasksRouter);

app.listen(PORT, () => {
  logger.info(`Server running at http://localhost:${PORT}`);
});
