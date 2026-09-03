const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');

// Helper: expire ho chuki active ads ko automatically deactivate kar deta hai
async function deactivateExpiredAds() {
  const now = new Date();
  await Ad.updateMany(
    { isActive: true, endDate: { $ne: null, $lte: now } },
    { isActive: false }
  );
}

// 1. ACTIVE ADS (public — website ke corner popup ke liye)
router.get('/active', async (req, res) => {
  try {
    await deactivateExpiredAds();
    const now = new Date();
    const ads = await Ad.find({
      isActive: true,
      $and: [
        { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
      ],
    }).sort({ createdAt: -1 });

    return res.json({ success: true, ads });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 2. LIST ALL ADS (Super Admin panel)
router.get('/all', async (req, res) => {
  try {
    await deactivateExpiredAds();
    const ads = await Ad.find().sort({ createdAt: -1 });
    return res.json({ success: true, ads });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. NAYA AD BANAO
router.post('/create', async (req, res) => {
  try {
    const { title, image, link, startDate, endDate, isActive } = req.body;

    if (!image) {
      return res.status(400).json({ success: false, message: 'Ad image zaroori hai.' });
    }

    const ad = await Ad.create({
      title: title || '',
      image,
      link: link || '',
      startDate: startDate || null,
      endDate: endDate || null,
      isActive: Boolean(isActive),
    });

    return res.status(201).json({ success: true, ad });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 4. AD DETAILS UPDATE KARO (Edit)
router.put('/:id', async (req, res) => {
  try {
    const { title, image, link, startDate, endDate } = req.body;
    const ad = await Ad.findByIdAndUpdate(
      req.params.id,
      {
        title: title || '',
        image,
        link: link || '',
        startDate: startDate || null,
        endDate: endDate || null,
      },
      { new: true }
    );
    if (!ad) return res.status(404).json({ success: false, message: 'Ad nahi mili.' });
    return res.json({ success: true, ad });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 5. ACTIVE/INACTIVE TOGGLE KARO
router.put('/:id/toggle', async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ success: false, message: 'Ad nahi mili.' });

    ad.isActive = !ad.isActive;
    await ad.save();

    return res.json({ success: true, ad });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 6. AD DELETE KARO
router.delete('/:id', async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Ad delete ho gayi.' });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;