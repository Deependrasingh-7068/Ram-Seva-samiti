require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

const authRoutes = require('./routes/auth');
const adminAuthRoutes = require('./routes/adminAuth');
const contentRoutes = require('./routes/contentRoutes'); // Content Management Routes
const notificationRoutes = require('./routes/notificationRoutes'); // <-- Notifications Route for all Admins

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log('Successfully connected to MongoDB'))
  .catch((err) => console.error('MongoDB connection error:', err));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

// API Routes Mount
app.use('/api/auth', authRoutes);
app.use('/api/admin-auth', adminAuthRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/notifications', notificationRoutes); // <-- Mount Notifications Route
app.use('/api/volunteers', require('./routes/volunteerRoutes'));

// Cloudinary & Upload router
const cloudinary = require('cloudinary').v2;
const uploadRouter = require('./routes/upload');
app.use('/api', uploadRouter);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// ... under other routes:
const volunteerRoutes = require('./routes/volunteerRoutes');
app.use('/api/volunteers', volunteerRoutes);