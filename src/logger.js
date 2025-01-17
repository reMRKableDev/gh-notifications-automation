const winston = require("winston");
const fs = require("fs");

const {
  createLogger,
  format: { combine, timestamp, errors, splat, json },
  transports,
} = winston;

const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = createLogger({
  level: "info",
  format: combine(
    timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    errors({ stack: true }),
    splat(),
    json()
  ),
  transports: [
    new transports.Console(),
    new transports.File({
      filename: `${logDir}/error.log`,
      level: "error",
    }),
  ],
});

module.exports = logger;
