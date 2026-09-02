const mongoose = require('mongoose');

const registrationCampaignSchema = new mongoose.Schema({
  title: { type: String, required: true },          // e.g. "Ram Navami Mahotsav 2026"
  bannerMessage: { type: String, required: true },   // top banner mein dikhne wala text
  startDate: { type: Date, default: null },
  endDate: { type: Date, default: null },
  isActive: { type: Boolean, default: false },       // ek waqt mein sirf ek hi active rahegi
}, { timestamps: true });

module.exports = mongoose.model('RegistrationCampaign', registrationCampaignSchema);