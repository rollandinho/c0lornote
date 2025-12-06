require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./server/config/database');
const { apiLimiter, authLimiter, createLimiter } = require('./server/middleware/rateLimiter');

const authRoutes = require('./server/routes/auth');
const userRoutes = require('./server/routes/users');
const noteRoutes = require('./server/routes/notes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Apply rate limiting to all API routes
app.use('/api/', apiLimiter);

// Routes with specific rate limiting
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/notes', noteRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'c0lornote API is running' });
});

// Welcome route
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to c0lornote - A social hub for people made by the people',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      notes: '/api/notes',
      health: '/api/health',
    },
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await connectDB();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Visit http://localhost:${PORT} for API information`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;
