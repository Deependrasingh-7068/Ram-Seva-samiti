const mongoose = require('mongoose');

const adSchema = new mongoose.Schema({
  title: { type: String, default: '' },       // Admin ke reference ke liye (sponsor/ad ka naam)
  image: { type: String, required: true },     // Ad ki image (landscape ya portrait, koi bhi)
  link: { type: String, default: '' },         // Click karne par kahan jaana hai (optional)
  isActive: { type: Boolean, default: false },
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model('Ad', adSchema);