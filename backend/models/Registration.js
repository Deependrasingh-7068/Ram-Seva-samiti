const mongoose = require('mongoose');

const registrationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  mobile: { type: String, required: true },
  email: { type: String },
  campaignId: { type: mongoose.Schema.Types.ObjectId, ref: 'RegistrationCampaign', required: true },
  campaignTitle: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Registration', registrationSchema);