const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Backend is running', timestamp: new Date() });
});

// Auth endpoints placeholder
app.post('/api/auth/register', (req, res) => {
  res.json({ message: 'Register endpoint', data: req.body });
});

app.post('/api/auth/login', (req, res) => {
  res.json({ message: 'Login endpoint', token: 'placeholder' });
});

// Assessment endpoints placeholder
app.get('/api/assessments', (req, res) => {
  res.json({ assessments: [] });
});

app.post('/api/assessments', (req, res) => {
  res.json({ message: 'Assessment created', data: req.body });
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
