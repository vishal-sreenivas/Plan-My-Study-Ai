// Main Express server file
// Sets up middleware, routes, and starts the server

import express from 'express';
import cors from 'cors';
import env from './config/env.js';
import { errorHandler } from './utils/errors.js';

// Import routes
import authRoutes from './routes/authRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import activityRoutes from './routes/activityRoutes.js';

// Create Express app
const app = express();

// Middleware
// CORS: Allow requests from frontend
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

// Body parser: Parse JSON request bodies
app.use(express.json());

// Request logging (simple middleware)
app.use((req, res, next) => {
  if (env.nodeEnv === 'development') {
    console.log(`${req.method} ${req.path}`);
  }
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/course', courseRoutes);
app.use('/api/activity', activityRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = env.port;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 Environment: ${env.nodeEnv}`);
});

