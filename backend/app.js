const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const projectRoutes = require('./routes/projects');

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Portfolio API is running.' });
});

module.exports = app;
