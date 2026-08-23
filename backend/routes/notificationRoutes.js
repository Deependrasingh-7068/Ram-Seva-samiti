const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// Notification Schema
const NotificationSchema = new mongoose.Schema(
  {
    section: { type: String, default: 'members' }, // members, events, seva, etc.
    message: { type: String, required: true },
    adminName: { type: String, default: 'Admin' },
    adminEmail: { type: String, default: '' },
    timestamp: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Notification = mongoose.models.Notification || mongoose.model('Notification', NotificationSchema);

// 1. GET all latest notifications (Public/All Admins)
router.get('/all', async (req, res) => {
  try {
    const list = await Notification.find().sort({ createdAt: -1 }).limit(50);
    return res.json({ success: true, notifications: list });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 2. POST create notification (Triggered whenever any admin creates a member/item)
router.post('/create', async (req, res) => {
  try {
    const { section, message, adminName, adminEmail } = req.body;
    if (!message) return res.status(400).json({ success: false, message: 'Message required' });

    const newNotif = new Notification({
      section: section || 'members',
      message,
      adminName: adminName || 'Admin',
      adminEmail: (adminEmail || '').toLowerCase().trim(),
    });

    await newNotif.save();
    return res.status(201).json({ success: true, notification: newNotif });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;