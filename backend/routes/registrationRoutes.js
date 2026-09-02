const express = require('express');
const router = express.Router();
const RegistrationCampaign = require('../models/RegistrationCampaign');
const Registration = require('../models/Registration');

// ===== CAMPAIGN MANAGEMENT (Super Admin control karta hai) =====

// 1. ACTIVE CAMPAIGN (public — top banner aur registration form dono isi ko use karte hain)
router.get('/active-campaign', async (req, res) => {
  try {
    const now = new Date();
    const campaign = await RegistrationCampaign.findOne({
      isActive: true,
      $and: [
        { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
      ],
    }).sort({ createdAt: -1 });

    return res.json({ success: true, campaign: campaign || null });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 2. LIST ALL CAMPAIGNS (Super Admin panel)
router.get('/campaigns', async (req, res) => {
  try {
    const campaigns = await RegistrationCampaign.find().sort({ createdAt: -1 });
    return res.json({ success: true, campaigns });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. NAYI CAMPAIGN BANAO
router.post('/campaign', async (req, res) => {
  try {
    const { title, bannerMessage, startDate, endDate, isActive } = req.body;

    if (!title || !bannerMessage) {
      return res.status(400).json({ success: false, message: 'Title aur banner message zaroori hai.' });
    }

    if (isActive) {
      // Ek waqt mein sirf ek hi campaign active rahegi
      await RegistrationCampaign.updateMany({}, { isActive: false });
    }

    const campaign = await RegistrationCampaign.create({
      title,
      bannerMessage,
      startDate: startDate || null,
      endDate: endDate || null,
      isActive: Boolean(isActive),
    });

    return res.status(201).json({ success: true, campaign });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 4. CAMPAIGN DETAILS UPDATE KARO
router.put('/campaign/:id', async (req, res) => {
  try {
    const { title, bannerMessage, startDate, endDate } = req.body;
    const campaign = await RegistrationCampaign.findByIdAndUpdate(
      req.params.id,
      { title, bannerMessage, startDate: startDate || null, endDate: endDate || null },
      { new: true }
    );
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign nahi mili.' });
    return res.json({ success: true, campaign });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 5. ACTIVE/INACTIVE TOGGLE KARO (activate karte hi baaki sab automatically off ho jaayengi)
router.put('/campaign/:id/toggle', async (req, res) => {
  try {
    const campaign = await RegistrationCampaign.findById(req.params.id);
    if (!campaign) return res.status(404).json({ success: false, message: 'Campaign nahi mili.' });

    const willActivate = !campaign.isActive;
    if (willActivate) {
      await RegistrationCampaign.updateMany({}, { isActive: false });
    }
    campaign.isActive = willActivate;
    await campaign.save();

    return res.json({ success: true, campaign });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 6. CAMPAIGN DELETE KARO
router.delete('/campaign/:id', async (req, res) => {
  try {
    await RegistrationCampaign.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Campaign delete ho gayi.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// ===== REGISTRATIONS (public submit + Super Admin viewing) =====

// 7. PUBLIC REGISTRATION SUBMIT (website ke /register page se)
router.post('/register', async (req, res) => {
  try {
    const { name, mobile, email } = req.body;

    if (!name || !mobile) {
      return res.status(400).json({ success: false, message: 'Naam aur mobile number zaroori hai.' });
    }

    const now = new Date();
    const activeCampaign = await RegistrationCampaign.findOne({
      isActive: true,
      $and: [
        { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
      ],
    });

    if (!activeCampaign) {
      return res.status(400).json({ success: false, message: 'Abhi koi registration active nahi hai.' });
    }

    const registration = await Registration.create({
      name,
      mobile,
      email,
      campaignId: activeCampaign._id,
      campaignTitle: activeCampaign.title,
    });

    return res.status(201).json({ success: true, message: 'Registration safal rahi!', registration });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 8. LIST ALL REGISTRATIONS (Super Admin panel)
router.get('/list', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });
    return res.json({ success: true, registrations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 9. EXPORT REGISTRATIONS AS CSV (Excel mein seedha khulti hai) — sirf Super Admin panel se use hota hai
router.get('/export', async (req, res) => {
  try {
    const registrations = await Registration.find().sort({ createdAt: -1 });

    const escapeCsv = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const header = ['S.No', 'Name', 'Mobile', 'Email', 'Campaign', 'Registered At'];

    const rows = registrations.map((r, i) => [
      i + 1,
      r.name,
      r.mobile,
      r.email || 'N/A',
      r.campaignTitle || 'N/A',
      new Date(r.createdAt).toLocaleString('en-IN'),
    ].map(escapeCsv).join(','));

    const csv = [header.map(escapeCsv).join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="SRSS_Registrations_${Date.now()}.csv"`);
    return res.send('\uFEFF' + csv);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;