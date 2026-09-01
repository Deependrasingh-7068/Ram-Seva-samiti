const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String },
  amount: { type: Number, required: true }, // Rupees mein
  razorpayOrderId: { type: String, required: true },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: { type: String, enum: ['created', 'paid', 'failed'], default: 'created' },
}, { timestamps: true });

module.exports = mongoose.model('Donation', donationSchema);