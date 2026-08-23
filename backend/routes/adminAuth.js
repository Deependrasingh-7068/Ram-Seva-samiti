const express = require('express');
const router = express.Router();
const User = require('../models/User');
const sendAdminCredentials = require('../utils/sendEmail');
const bcrypt = require('bcryptjs'); // Assuming bcrypt is used for password comparison if hashed
const jwt = require('jsonwebtoken'); // Assuming bcrypt is used for password comparison if hashed

const sanitizeField = (val) => {
  if (!val || typeof val !== 'string' || val.trim().length === 0) return 'NA';
  return val.trim();
};

// 1. Admin Login API (Aadhaar & Flexible DOB Verification with Freeze Check)
router.post('/login', async (req, res) => {
  try {
    const { aadhaar, dob } = req.body;
    
    if (!aadhaar || !dob) {
      return res.status(400).json({ 
        success: false, 
        message: 'Aadhaar number and Date of Birth are required for login.' 
      });
    }

    const cleanAadhaar = aadhaar.trim();
    const inputDob = dob.trim(); // e.g., "10032004"

    // Database se us Aadhaar wala admin find karein
    const admin = await User.findOne({ 
      aadhaar: cleanAadhaar, 
      role: { $in: ['admin', 'ADMIN', 'superadmin'] } 
    });

    if (!admin) {
      return res.status(400).json({ 
        success: false, 
        message: 'Your Aadhaar number is not registered here, Sorry' 
      });
    }

    // CHECK IF ADMIN IS FROZEN (BLOCKED)
    if (admin.isFrozen) {
      return res.status(403).json({
        success: false,
        isFrozen: true,
        message: "नियमों के अनुरूप न होने वाली गतिविधियों के कारण आपका खाता अस्थायी रूप से फ्रीज़ किया गया है।"
      });
    }

    // Database DOB format ("YYYY-MM-DD") ko convert karein "DDMMYYYY" mein taaki input se match ho sake
    let dbDobFormatted = admin.dob; // e.g., "2004-03-10"
    if (dbDobFormatted && dbDobFormatted.includes('-')) {
      const parts = dbDobFormatted.split('-'); // ['2004', '03', '10']
      if (parts.length === 3) {
        dbDobFormatted = `${parts[2]}${parts[1]}${parts[0]}`; // "10032004"
      }
    }

    // Match check: Chahe raw DB string match ho ya formatted DDMMYYYY match ho
    if (admin.dob !== inputDob && dbDobFormatted !== inputDob) {
      return res.status(400).json({ 
        success: false, 
        message: 'Your Aadhaar number is not registered here, Sorry' 
      });
    }

    res.status(200).json({ success: true, admin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 2. Superadmin: Create New Admin & Send Email
router.post('/create-admin', async (req, res) => {
  try {
    const { adminId, name, email, password, contact, aadhaar, dob, designation, designationHindi, photo } = req.body;

    if (!aadhaar || !dob) {
      return res.status(400).json({ success: false, message: 'Aadhaar and Date of Birth are mandatory fields!' });
    }

    const cleanEmail = email?.trim().toLowerCase();
    let existingUser = await User.findOne({ $or: [{ email: cleanEmail }, { aadhaar: aadhaar.trim() }] });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Admin already exists with this email or Aadhaar number!' });
    }

    const newAdmin = new User({
      adminId: adminId?.trim(),
      name: name?.trim(),
      email: cleanEmail,
      password: password || 'default123',
      contact: sanitizeField(contact),
      aadhaar: aadhaar.trim(),
      dob: dob.trim(),
      designation: 'Administrator', // Fixed locked value
      designationHindi: 'प्रशासक',   // Fixed locked value
      photo: photo || '',
      role: 'admin',
      isFrozen: false,
    });

    await newAdmin.save();

    try {
      if (typeof sendAdminCredentials === 'function') {
        await sendAdminCredentials(cleanEmail, name, password, contact);
      }
    } catch (emailError) {
      console.log('Admin created in DB, but email sending failed:', emailError.message);
    }

    res.status(201).json({ success: true, message: 'Admin created & credentials processed successfully!', admin: newAdmin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 3. Superadmin: Reset Admin Password
router.put('/reset-password/:id', async (req, res) => {
  try {
    const { newPassword } = req.body;
    
    if (!newPassword) {
      return res.status(400).json({ success: false, message: 'New password is required!' });
    }

    const updated = await User.findByIdAndUpdate(req.params.id, { password: newPassword }, { new: true });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Admin not found!' });
    }

    res.status(200).json({ success: true, message: 'Password reset successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 4. Superadmin: Delete Admin
router.delete('/delete-admin/:id', async (req, res) => {
  try {
    const deletedAdmin = await User.findByIdAndDelete(req.params.id);
    if (!deletedAdmin) {
      return res.status(404).json({ success: false, message: 'Admin not found!' });
    }
    res.status(200).json({ success: true, message: 'Admin deleted successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 5. Toggle Admin Freeze / Unfreeze Status (SuperAdmin Authority)
router.put('/toggle-freeze/:id', async (req, res) => {
  try {
    const admin = await User.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found!' });
    }

    admin.isFrozen = req.body.isFrozen !== undefined ? req.body.isFrozen : !admin.isFrozen;
    await admin.save();

    res.status(200).json({ success: true, message: 'Admin freeze status updated successfully', admin });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 6. Get All Admins List
router.get('/list', async (req, res) => {
  try {
    const admins = await User.find({ role: { $in: ['admin', 'ADMIN', 'superadmin'] } }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, admins });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 7. Normal User Signup API
router.post('/user-signup', async (req, res) => {
  try {
    const { name, email, phone, password, aadhaar, dob } = req.body;
    const cleanEmail = email?.trim().toLowerCase();

    let existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email!' });
    }

    const newUser = new User({
      name: name?.trim(),
      email: cleanEmail,
      phone: phone?.trim(),
      password,
      aadhaar: aadhaar?.trim() || 'NA',
      dob: dob?.trim() || 'NA',
      role: 'user',
      designation: 'Member',
      designationHindi: 'सदस्य',
    });

    await newUser.save();
    res.status(201).json({ success: true, message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. Normal User Login API
router.post('/user-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email: email?.trim().toLowerCase(), role: 'user' });

    if (!user || user.password !== password) {
      return res.status(400).json({ success: false, message: 'Invalid email or password!' });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 9. Get First Admin Credentials for Quick Demo Fill
router.get('/demo-admin', async (req, res) => {
  try {
    const admin = await User.findOne({ role: { $in: ['admin', 'ADMIN', 'superadmin'] } });
    if (!admin) {
      return res.status(404).json({ success: false, message: 'No admin found in database!' });
    }
    res.status(200).json({ 
      success: true, 
      admin: {
        name: admin.name,
        contact: admin.contact,
        email: admin.email,
        aadhaar: admin.aadhaar,
        dob: admin.dob,
        password: admin.password
      } 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 10. PUT: Update Admin Details by ID (Locked designation enforced)
router.put('/update-admin/:id', async (req, res) => {
  try {
    const { name, email, contact, photo } = req.body;
    
    const updateData = {
      name: name?.trim(),
      email: email?.trim().toLowerCase(),
      contact: sanitizeField(contact),
      designation: 'Administrator',
      designationHindi: 'प्रशासक',
      photo: photo || '',
    };

    const updatedAdmin = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedAdmin) {
      return res.status(404).json({ success: false, message: 'Admin not found in database.' });
    }

    res.status(200).json({ 
      success: true, 
      message: 'Admin updated successfully in database!', 
      admin: updatedAdmin 
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 11. Verify Admin DOB to Reveal Full ID (SuperAdmin Feature)
router.post('/verify-dob/:id', async (req, res) => {
  try {
    const { dob } = req.body;
    if (!dob) {
      return res.status(400).json({ success: false, message: 'Date of Birth is required for verification.' });
    }

    const admin = await User.findById(req.params.id);
    if (!admin) {
      return res.status(404).json({ success: false, message: 'Admin not found.' });
    }

    let dbDobFormatted = admin.dob;
    if (dbDobFormatted && dbDobFormatted.includes('-')) {
      const parts = dbDobFormatted.split('-');
      if (parts.length === 3) {
        dbDobFormatted = `${parts[2]}${parts[1]}${parts[0]}`;
      }
    }

    if (admin.dob !== dob.trim() && dbDobFormatted !== dob.trim()) {
      return res.status(400).json({ success: false, message: 'Incorrect Date of Birth!' });
    }

    res.status(200).json({ success: true, aadhaar: admin.aadhaar });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 12. Super Admin Login — fixed ID/Password from .env, koi DB lookup nahi
router.post('/superadmin-login', (req, res) => {
  try {
    const { superAdminId, password } = req.body;

    if (!superAdminId || !password) {
      return res.status(400).json({ success: false, message: 'Super Admin ID and Password are required.' });
    }

    const validId = process.env.SUPERADMIN_ID;
    const validPassword = process.env.SUPERADMIN_PASSWORD;

    if (superAdminId.trim() !== validId || password !== validPassword) {
      return res.status(401).json({ success: false, message: 'Invalid Super Admin ID or Password.' });
    }

    const token = jwt.sign(
      { role: 'superadmin', id: validId },
      process.env.JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.status(200).json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;