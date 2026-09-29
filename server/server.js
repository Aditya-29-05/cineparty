import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import { connectDB } from './config/db.js';
import { initializeSocket } from './sockets/socketHandler.js';
import { apiLimiter } from './middleware/rateLimiter.js';
import { notFound, errorHandler } from './middleware/errorMiddleware.js';
import { logger } from './utils/logger.js';

import authRoutes from './routes/authRoutes.js';
import roomRoutes from './routes/roomRoutes.js';

const app = express();
const server = http.createServer(app);

// Security & Parsing Middleware
app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiter to /api
app.use('/api', apiLimiter);

// Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    app: 'CineParty Server'
  });
});

// Auth & Room Routes
app.use('/api/auth', authRoutes);
app.use('/api/rooms', roomRoutes);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Initialize Socket.IO
const io = initializeSocket(server);
app.set('io', io);

// Start Server
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  server.listen(PORT, () => {
    logger.info(`CineParty server running on port ${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
});
