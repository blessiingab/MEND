'use strict';
const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const storyRoutes = require('./routes/stories');
const therapyRoutes = require('./routes/therapy');
const assessmentRoutes = require('./routes/assessment');
const resourceRoutes = require('./routes/resources');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Connection to MongoDB
mongoose.connect(process.env.DB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/stories', storyRoutes);
app.use('/api/therapy', therapyRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/resources', resourceRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
