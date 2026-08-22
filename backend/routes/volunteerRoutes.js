const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Helper to sanitize continuous digits
function sanitizeDigits(val) {
  if (!val) return '';
  return String(val).replace(/\D/g, '').trim();
}

// 1. Volunteer Schema with Mandatory Aadhaar Field
const VolunteerSchema = new mongoose.Schema(
  {
    volunteerId: { 
      type: String, 
      unique: true, 
      required: true,
      index: true 
    },
    aadhaarNumber: { 
      type: String, 
      required: true, 
      index: true 
    },
    nameHindi: { type: String, required: true },
    nameEnglish: { type: String, default: '' },
    roleHindi: { type: String, default: 'स्वयंसेवक' },
    roleEnglish: { type: String, default: 'Volunteer' },
    dob: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, default: '' },
    address: { type: String, required: true },
    bloodGroup: { type: String, default: 'N/A' },
    photo: { type: String, default: '' },
    membershipSince: { type: String, default: () => new Date().toLocaleDateString('en-IN') },
    dateOfIssue: { type: String, default: () => new Date().toLocaleDateString('en-IN') },
    status: { 
      type: String, 
      enum: ['PENDING', 'ACCEPTED', 'REJECTED', 'REMOVED'], 
      default: 'PENDING' 
    },
    approvedBy: { type: String, default: '' },
    approvedByEmail: { type: String, default: '' },
    approvedAt: { type: Date },
  },
  { 
    timestamps: true,
    collection: 'volunteers'
  }
);

if (mongoose.models.Volunteer) {
  delete mongoose.models.Volunteer;
}
const Volunteer = mongoose.model('Volunteer', VolunteerSchema);

// 2. GET ALL VOLUNTEERS
router.get('/all', async (req, res) => {
  try {
    const list = await Volunteer.find().sort({ createdAt: -1 });
    return res.json({ success: true, volunteers: list });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. APPLY / SUBMIT FORM
router.post('/apply', async (req, res) => {
  try {
    const rawAadhaar = req.body.aadhaarNumber || req.body.aadhar || req.body.aadhaar;
    const cleanAadhaar = sanitizeDigits(rawAadhaar);
    const cleanDob = sanitizeDigits(req.body.dob);
    const cleanPhone = sanitizeDigits(req.body.phone);

    if (!cleanAadhaar || cleanAadhaar.length !== 12) {
      return res.status(400).json({ success: false, message: 'Valid 12-digit Aadhaar number is required.' });
    }

    if (!cleanDob || cleanDob.length !== 8) {
      return res.status(400).json({ success: false, message: 'Valid 8-digit Date of Birth (DDMMYYYY) is required.' });
    }

    const existingVolunteer = await Volunteer.findOne({
      $or: [
        { aadhaarNumber: cleanAadhaar },
        { phone: cleanPhone }
      ]
    });

    if (existingVolunteer) {
      existingVolunteer.aadhaarNumber = cleanAadhaar;
      if (req.body.nameHindi) existingVolunteer.nameHindi = req.body.nameHindi.trim();
      if (req.body.nameEnglish) existingVolunteer.nameEnglish = req.body.nameEnglish.trim();
      if (cleanDob) existingVolunteer.dob = cleanDob;
      if (cleanPhone) existingVolunteer.phone = cleanPhone;
      if (req.body.address) existingVolunteer.address = req.body.address.trim();
      if (req.body.photo) existingVolunteer.photo = req.body.photo;
      if (req.body.bloodGroup) existingVolunteer.bloodGroup = req.body.bloodGroup.trim();
      if (req.body.email) existingVolunteer.email = req.body.email.trim();
      
      await existingVolunteer.save();
      return res.json({
        success: true,
        isExisting: true,
        message: 'Aap pehle se registered hain! Aapki assigned Volunteer ID fetch kar li gayi hai.',
        volunteer: existingVolunteer,
      });
    }

    const count = await Volunteer.countDocuments();
    const currentYear = new Date().getFullYear();
    const randomDigits = Math.floor(1000 + Math.random() * 9000);
    const volunteerId = `SRSS${currentYear}${randomDigits}${count + 1}`;

    const newVolunteer = new Volunteer({
      volunteerId,
      aadhaarNumber: cleanAadhaar,
      nameHindi: req.body.nameHindi ? req.body.nameHindi.trim() : '',
      nameEnglish: req.body.nameEnglish ? req.body.nameEnglish.trim() : '',
      dob: cleanDob,
      phone: cleanPhone,
      email: req.body.email ? req.body.email.trim() : '',
      address: req.body.address ? req.body.address.trim() : '',
      bloodGroup: req.body.bloodGroup ? req.body.bloodGroup.trim() : 'N/A',
      photo: req.body.photo || '',
      status: 'PENDING',
    });

    await newVolunteer.save();
    return res.status(201).json({
      success: true,
      isExisting: false,
      message: 'Aapka aavedan safalta-purvak darj ho gaya hai.',
      volunteer: newVolunteer,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 4. VERIFY & DOWNLOAD CARD
router.post('/verify-card', async (req, res) => {
  try {
    const { loginId, dob } = req.body;
    if (!loginId || !dob) {
      return res.status(400).json({ success: false, message: 'Aadhaar / Volunteer ID and DOB are required.' });
    }

    const cleanInput = sanitizeDigits(loginId);
    const cleanDob = sanitizeDigits(dob);
    const rawLoginId = String(loginId).trim();

    const volunteer = await Volunteer.findOne({
      $and: [
        {
          $or: [
            { aadhaarNumber: cleanInput },
            { volunteerId: rawLoginId },
            { phone: cleanInput }
          ]
        },
        { dob: cleanDob }
      ]
    });

    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Invalid Credentials. Details do not match our database.' });
    }

    return res.json({ success: true, volunteer });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 5. STATUS UPDATE & PERMANENT REMOVE
router.put('/status/:id', async (req, res) => {
  try {
    const { status, adminName, adminEmail } = req.body;
    
    const volunteer = await Volunteer.findById(req.params.id);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found.' });
    }

    // Prevent conflicting updates if already finalized
    if (volunteer.status === 'ACCEPTED' || volunteer.status === 'REJECTED') {
      return res.status(400).json({ 
        success: false, 
        message: `This request has already been ${volunteer.status.toLowerCase()} by ${volunteer.approvedBy || 'an admin'}.` 
      });
    }

    const updateData = { status };

    if (status === 'ACCEPTED' || status === 'REJECTED') {
      updateData.approvedBy = adminName || 'Admin';
      updateData.approvedByEmail = adminEmail || '';
      updateData.approvedAt = new Date();
    }

    const updated = await Volunteer.findByIdAndUpdate(req.params.id, updateData, { new: true });
    return res.json({ success: true, volunteer: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

router.delete('/remove/:id', async (req, res) => {
  try {
    await Volunteer.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Volunteer permanently removed' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE VOLUNTEER BY ID OR AADHAAR (FOR SUPERADMIN)
router.put('/update-profile-secure', async (req, res) => {
  try {
    const { volunteerId, aadhaarNumber, nameHindi, nameEnglish, phone, email, address } = req.body;
    
    // Search by volunteerId or aadhaarNumber
    let query = {};
    if (volunteerId) query.volunteerId = volunteerId.trim();
    else if (aadhaarNumber) query.aadhaarNumber = String(aadhaarNumber).replace(/\D/g, '').trim();
    else {
      return res.status(400).json({ success: false, message: 'Volunteer ID or Aadhaar is required for identification.' });
    }

    const volunteer = await Volunteer.findOne(query);
    if (!volunteer) {
      return res.status(404).json({ success: false, message: 'Volunteer not found in database.' });
    }

    const updateData = {};
    if (nameHindi !== undefined) updateData.nameHindi = nameHindi.trim();
    if (nameEnglish !== undefined) updateData.nameEnglish = nameEnglish.trim();
    if (phone !== undefined) updateData.phone = phone.trim();
    if (email !== undefined) updateData.email = email.trim();
    if (address !== undefined) updateData.address = address.trim();

    const updated = await Volunteer.findOneAndUpdate(query, updateData, { new: true });
    return res.json({ success: true, volunteer: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;