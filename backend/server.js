require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');

// ==========================================
// 1. IMPORT ALL ROUTES HERE (Top of the file)
// ==========================================
const authRoutes = require('./routes/auth');
const adminAuthRoutes = require('./routes/adminAuth');
const contentRoutes = require('./routes/contentRoutes'); 
const notificationRoutes = require('./routes/notificationRoutes'); 
const volunteerRoutes = require('./routes/volunteerRoutes');
const officeBearerRoutes = require('./routes/officeBearerRoutes'); // Office Bearer route imported
const eventRoutes = require('./routes/eventRoutes'); // Events route imported — ye pehle mount hi nahi thi
const donationRoutes = require('./routes/donationRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

const app = express();

app.use(helmet());
const allowedOrigins = [
  'http://localhost:5173',
  'https://ram-seva-samiti.vercel.app',
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
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

// ==========================================
// 2. MOUNT API ROUTES HERE (Before 404 Fallback)
// ==========================================
app.use('/api/auth', authRoutes);
app.use('/api/admin-auth', adminAuthRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/notifications', notificationRoutes); 
app.use('/api/volunteers', volunteerRoutes);
app.use('/api/office-bearers', officeBearerRoutes); // Correctly placed above 404
app.use('/api/events', eventRoutes); // Ab events route active hai
app.use('/api/donations', donationRoutes);
app.use('/api/registrations', registrationRoutes);

// NOTE: Agar events ke liye alag route hai, toh use yahan mount karein:
// app.use('/api/events', eventRoutes);


// Cloudinary & Upload router
const cloudinary = require('cloudinary').v2;
const uploadRouter = require('./routes/upload');
app.use('/api', uploadRouter);

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


// ==========================================
// 3. FALLBACK & ERROR HANDLERS (Must be at the very bottom)
// ==========================================

// 404 fallback
app.use((req, res) => {
  res.status(404).json({ message: 'Not found route in backend' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));