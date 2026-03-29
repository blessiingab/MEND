/**
 * Main Server File
 */
require('dotenv').config();
require('express-async-errors');

const fs = require('fs');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const path = require('path');
const logger = require('./utils/logger');

// Routes
const authRoutes = require('./routes/authRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const sessionRoutes = require('./routes/sessionRoutes');
const postRoutes = require('./routes/postRoutes');
const careerRoutes = require('./routes/careerRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const frontendBuildPath = path.resolve(__dirname, '../../frontend/build');
const frontendIndexPath = path.join(frontendBuildPath, 'index.html');
const configuredOrigins = [process.env.CLIENT_URL, process.env.APP_URL, process.env.CORS_ORIGINS]
  .filter(Boolean)
  .join(',');
const allowedOrigins = configuredOrigins
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);
const normalizedAllowedOrigins = new Set(
  allowedOrigins
    .map((origin) => {
      try {
        return new URL(origin).origin;
      } catch (error) {
        logger.warn('Ignoring invalid CORS origin configuration', { origin });
        return null;
      }
    })
    .filter(Boolean)
);

const isPrivateNetworkHost = (hostname) => {
  if (!hostname) return false;

  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return true;
  }

  const octets = hostname.split('.').map((value) => Number(value));
  if (octets.length !== 4 || octets.some((value) => Number.isNaN(value) || value < 0 || value > 255)) {
    return false;
  }

  if (octets[0] === 10 || octets[0] === 127) {
    return true;
  }

  if (octets[0] === 192 && octets[1] === 168) {
    return true;
  }

  if (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31) {
    return true;
  }

  return octets[0] === 169 && octets[1] === 254;
};

const isDevelopmentOriginAllowed = (origin) => {
  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  try {
    const parsedOrigin = new URL(origin);
    return ['http:', 'https:'].includes(parsedOrigin.protocol) && isPrivateNetworkHost(parsedOrigin.hostname);
  } catch (error) {
    return false;
  }
};

// Middleware
app.use(helmet());
app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = (() => {
        try {
          return new URL(origin).origin;
        } catch (error) {
          return origin;
        }
      })();

      if (
        normalizedAllowedOrigins.size === 0 ||
        normalizedAllowedOrigins.has(normalizedOrigin) ||
        isDevelopmentOriginAllowed(normalizedOrigin)
      ) {
        return callback(null, true);
      }

      logger.warn('Blocked request due to CORS origin', { origin: normalizedOrigin });
      return callback(new Error('Origin not allowed by CORS'));
    }
  })
);
app.use(morgan('combined'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/sessions', sessionRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/career', careerRoutes);
app.use('/api/admin', adminRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

if (fs.existsSync(frontendIndexPath)) {
  app.use(express.static(frontendBuildPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api') || req.path === '/health') {
      return next();
    }

    return res.sendFile(frontendIndexPath);
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  logger.error('Unhandled error', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// 404 handler
app.use((req, res) => {
  if (!req.path.startsWith('/api')) {
    return res.status(404).send('Not found');
  }

  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`, { environment: process.env.NODE_ENV });
});

module.exports = app;
