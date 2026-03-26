const fs = require('fs');
const path = require('path');

const logsDir = path.join(__dirname, '../../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

const getTimestamp = () => {
  return new Date().toISOString();
};

const logger = {
  info: (message, data = {}) => {
    const log = `[${getTimestamp()}] INFO: ${message}`;
    console.log(log, data);
  },

  error: (message, error = {}) => {
    const log = `[${getTimestamp()}] ERROR: ${message}`;
    console.error(log, error);
  },

  warn: (message, data = {}) => {
    const log = `[${getTimestamp()}] WARN: ${message}`;
    console.warn(log, data);
  },

  debug: (message, data = {}) => {
    if (process.env.NODE_ENV === 'development') {
      const log = `[${getTimestamp()}] DEBUG: ${message}`;
      console.log(log, data);
    }
  }
};

module.exports = logger;
