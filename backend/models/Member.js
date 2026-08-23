const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  nameHindi: { type: String, required: true },
  nameEnglish: { type: String, default: '' },
  name: { type: String, required: true },
  roleHindi: { type: String, required: true },
  roleEnglish: { type: String, required: true },
  role: { type: String, required: true },
  designation: { type: String, required: true },
  designationHindi: { type: String, required: true },
  phone: { type: String, default: '' },
  email: { type: String, default: '' },
  aadhar: { type: String, default: '' },
  dob: { type: String, default: '' },
  bio: { type: String, default: '' },         // <-- Added bio field
  description: { type: String, default: '' }, // <-- Added description fallback
  image: { type: String, default: '' },
  photo: { type: String, default: '' },
  adminName: { type: String, default: 'Admin' },
  createdBy: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);