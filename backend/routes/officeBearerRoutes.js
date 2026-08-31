const express = require('express');
const router = express.Router();
const OfficeBearer = require('../models/OfficeBearer');

// Helper to sanitize continuous digits
function sanitizeDigits(val) {
  if (!val) return '';
  return String(val).replace(/\D/g, '').trim();
}

// 1. GET ALL OFFICE BEARERS
router.get('/all', async (req, res) => {
  try {
    const bearers = await OfficeBearer.find().sort({ createdAt: -1 });
    return res.json({ success: true, officeBearers: bearers });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. CREATE / ASSIGN OFFICE BEARER (Strictly 1 per designation)
router.post('/create', async (req, res) => {
  try {
    const { designation, designationHindi, nameHindi, nameEnglish, email, password, contact, aadhaarNumber, dob, photo } = req.body;

    if (!designation || !nameHindi || !email || !password || !aadhaarNumber || !dob) {
      return res.status(400).json({ success: false, message: 'All required fields must be provided.' });
    }

    // Check if this designation already exists in the system
    const existingDesignation = await OfficeBearer.findOne({ designation });
    if (existingDesignation) {
      return res.status(400).json({ 
        success: false, 
        message: `A ${designation} already exists in the Samiti. Only one active holder is allowed per designation.` 
      });
    }

    const cleanAadhaar = sanitizeDigits(aadhaarNumber);
    const cleanDob = sanitizeDigits(dob);

    const prefix = nameHindi.replace(/[^a-zA-Z]/g, '').slice(0, 3).toUpperCase() || 'SRSS';
    const bearerId = `SRSSOB${prefix}${Math.floor(1000 + Math.random() * 9000)}`;

    const newBearer = new OfficeBearer({
      bearerId,
      designation,
      designationHindi: designationHindi || 'पदाधिकारी',
      nameHindi: nameHindi.trim(),
      nameEnglish: nameEnglish ? nameEnglish.trim() : '',
      email: email.trim().toLowerCase(),
      password: password.trim(),
      contact: contact ? contact.trim() : 'NA',
      aadhaarNumber: cleanAadhaar,
      dob: cleanDob,
      photo: photo || ''
    });

    await newBearer.save();
    return res.status(201).json({
      success: true,
      message: `Office Bearer (${designation}) created successfully with ID: ${bearerId}`,
      officeBearer: newBearer
    });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ success: false, message: 'Email or Designation already exists in database.' });
    }
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 3. OFFICE BEARER LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { loginId, dob } = req.body;
    if (!loginId || !dob) {
      return res.status(400).json({ success: false, message: 'Aadhaar / Bearer ID / Email and DOB are required.' });
    }

    const cleanInput = sanitizeDigits(loginId);
    const cleanDob = sanitizeDigits(dob);
    const rawLoginId = String(loginId).trim().toLowerCase();

    const bearer = await OfficeBearer.findOne({
      $and: [
        {
          $or: [
            { aadhaarNumber: cleanInput },
            { bearerId: String(loginId).trim() },
            { email: rawLoginId }
          ]
        },
        { dob: cleanDob }
      ]
    });

    if (!bearer) {
      return res.status(404).json({ success: false, message: 'Invalid credentials. Please check your ID/Aadhaar and Date of Birth.' });
    }

    if (bearer.isFrozen) {
      return res.status(403).json({ success: false, message: 'This account has been frozen by the Super Admin.' });
    }

    return res.json({ success: true, message: 'Login successful', officeBearer: bearer });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 4. VERIFY DOB TO REVEAL AADHAAR (For SuperAdmin Edit Modal)
router.post('/verify-dob/:id', async (req, res) => {
  try {
    const { dob } = req.body;
    const bearer = await OfficeBearer.findById(req.params.id);
    
    if (!bearer) {
      return res.status(404).json({ success: false, message: 'Office Bearer not found.' });
    }

    const cleanInputDob = sanitizeDigits(dob);
    if (cleanInputDob === sanitizeDigits(bearer.dob)) {
      return res.json({ success: true, aadhaar: bearer.aadhaarNumber });
    } else {
      return res.status(400).json({ success: false, message: 'Incorrect Date of Birth!' });
    }
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 5. UPDATE OFFICE BEARER PROFILE
router.put('/update/:id', async (req, res) => {
  try {
    const { nameHindi, nameEnglish, email, contact, photo } = req.body;
    const updateData = {};

    if (nameHindi !== undefined) updateData.nameHindi = nameHindi.trim();
    if (nameEnglish !== undefined) updateData.nameEnglish = nameEnglish.trim();
    if (email !== undefined) updateData.email = email.trim().toLowerCase();
    if (contact !== undefined) updateData.contact = contact.trim();
    if (photo !== undefined) updateData.photo = photo;

    const updated = await OfficeBearer.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Office Bearer not found.' });
    }

    return res.json({ success: true, message: 'Profile updated successfully', officeBearer: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 6. TOGGLE FREEZE / UNFREEZE STATUS
router.put('/freeze/:id', async (req, res) => {
  try {
    const { isFrozen } = req.body;
    const bearer = await OfficeBearer.findByIdAndUpdate(
      req.params.id,
      { isFrozen: Boolean(isFrozen) },
      { new: true }
    );

    if (!bearer) {
      return res.status(404).json({ success: false, message: 'Office Bearer not found.' });
    }

    return res.json({ success: true, officeBearer: bearer });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 7b. LIVE STATUS CHECK (used by OB dashboard to detect a freeze during an active session)
router.get('/status/:id', async (req, res) => {
  try {
    const bearer = await OfficeBearer.findById(req.params.id).select('isFrozen nameHindi');
    if (!bearer) {
      return res.status(404).json({ success: false, message: 'Office Bearer not found.' });
    }
    return res.json({ success: true, isFrozen: bearer.isFrozen });
  } catch (err) {
    return res.status(500).json({ success: false, message: err.message });
  }
});

// 7. PERMANENT REMOVE OFFICE BEARER
router.delete('/remove/:id', async (req, res) => {
  try {
    await OfficeBearer.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Office Bearer permanently removed from database.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;