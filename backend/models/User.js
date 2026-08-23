const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    adminId: {
      type: String,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    contact: {
      type: String,
      trim: true,
    },
    aadhaar: {
      type: String,
      required: [true, 'Aadhaar number is required'],
      unique: true,
      trim: true,
    },
    dob: {
      type: String,
      required: [true, 'Date of Birth is required'],
      trim: true,
    },
    designation: {
      type: String,
      default: 'Administrator',
    },
    designationHindi: {
      type: String,
      default: 'प्रशासक',
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long'],
    },
    photo: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['USER', 'ADMIN', 'user', 'admin', 'superadmin'],
      default: 'user',
    },
    isFrozen: {
      type: Boolean,
      default: false, // <-- Naya field: Admin freeze/unfreeze status ke liye
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('User', userSchema);