
// Import the Express framework to create the web server
import express from 'express';
// Load environment variables from .env file
import dotenv from 'dotenv';

// Import route handlers for different domains
import userRoutes from './routes/userRoutes.js';
import accountRoutes from './routes/accountRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Import middleware to verify JWT token
import { authMiddleware } from './middleware/auth.js';

// Import and initialize the database
import { initDB } from './db/init.js';

dotenv.config(); // Load environment variables

const app = express(); // Create Express app instance
app.use(express.json()); // Parse incoming JSON requests

initDB(); // Initialize SQLite database and tables

// Public route for authentication (login/register)
app.use('/auth', authRoutes);
// Public route to create and fetch user info
app.use('/v1/users', userRoutes);
// Protected routes for account operations (requires JWT)
app.use('/v1/accounts', authMiddleware, accountRoutes);
// Protected routes for transaction operations (requires JWT)
app.use('/v1/accounts', authMiddleware, transactionRoutes);

// Global error handler middleware
app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ message: err.message });
});

export default app;
