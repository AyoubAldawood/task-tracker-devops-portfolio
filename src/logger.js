const { createLogger, format, transports } = require("winston");
const path = require("path");

// Log file will be saved to logs/app.log
const logFilePath = path.join(__dirname, "..", "logs", "app.log");

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp(),
    format.printf(({ timestamp, level, message }) => {
      return `${timestamp} [${level.toUpperCase()}] ${message}`;
    })
  ),
  transports: [
    // Log to console (useful for dev & Docker)
    new transports.Console(),
    // Log to file (for persistent logs)
    new transports.File({ filename: logFilePath }),
  ],
});

module.exports = logger;
