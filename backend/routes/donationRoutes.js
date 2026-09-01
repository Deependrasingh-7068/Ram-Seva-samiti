const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Donation = require('../models/Donation');

const RAZORPAY_KEY_ID = process.env.RAZORPAY_KEY_ID;
const RAZORPAY_KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

// 1. CREATE ORDER — donation form submit hote hi ye call hota hai
router.post('/create-order', async (req, res) => {
  try {
    const { name, mobile, email, amount } = req.body;

    if (!name || !mobile || !amount || Number(amount) <= 0) {
      return res.status(400).json({ success: false, message: 'Naam, mobile aur valid amount zaroori hai.' });
    }

    const amountInPaise = Math.round(Number(amount) * 100);
    const authHeader = 'Basic ' + Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');

    const rpRes = await fetch('https://api.razorpay.com/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: authHeader },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        receipt: `srss_don_${Date.now()}`,
        notes: { donorName: name, donorMobile: mobile },
      }),
    });

    const order = await rpRes.json();

    if (!rpRes.ok) {
      return res.status(500).json({ success: false, message: order?.error?.description || 'Razorpay order create nahi ho paya.' });
    }

    await Donation.create({
      name, mobile, email,
      amount: Number(amount),
      razorpayOrderId: order.id,
      status: 'created',
    });

    return res.json({
      success: true,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 2. VERIFY PAYMENT — Razorpay checkout success hone ke baad frontend ye call karta hai
router.post('/verify', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Payment details missing hain.' });
    }

    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest('hex');

    if (expectedSignature !== razorpay_signature) {
      await Donation.findOneAndUpdate({ razorpayOrderId: razorpay_order_id }, { status: 'failed' });
      return res.status(400).json({ success: false, message: 'Payment verify nahi ho paya. Signature match nahi hui.' });
    }

    const donation = await Donation.findOneAndUpdate(
      { razorpayOrderId: razorpay_order_id },
      { status: 'paid', razorpayPaymentId: razorpay_payment_id, razorpaySignature: razorpay_signature },
      { new: true }
    );

    return res.json({ success: true, message: 'Payment safal raha!', donation });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 3. LIST SUCCESSFUL DONATIONS (Admin / OB / Super Admin dashboards ke liye)
router.get('/list', async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'paid' })
      .sort({ createdAt: -1 })
      .select('name mobile email amount razorpayPaymentId createdAt');
    return res.json({ success: true, donations });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

// 4. EXPORT ALL SUCCESSFUL DONATIONS (CSV — Excel mein seedha khulti hai) — sirf Super Admin panel se use hota hai
router.get('/export', async (req, res) => {
  try {
    const donations = await Donation.find({ status: 'paid' }).sort({ createdAt: -1 });

    const escapeCsv = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
    const header = ['S.No', 'Name', 'Mobile', 'Email', 'Amount (INR)', 'Payment ID', 'Date & Time'];

    const rows = donations.map((d, i) => [
      i + 1,
      d.name,
      d.mobile,
      d.email || 'N/A',
      d.amount,
      d.razorpayPaymentId || 'N/A',
      new Date(d.createdAt).toLocaleString('en-IN'),
    ].map(escapeCsv).join(','));

    const totalAmount = donations.reduce((sum, d) => sum + (d.amount || 0), 0);
    rows.push('');
    rows.push([escapeCsv('Total'), '', '', '', escapeCsv(totalAmount), '', ''].join(','));

    const csv = [header.map(escapeCsv).join(','), ...rows].join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="SRSS_Donations_${Date.now()}.csv"`);
    return res.send('\uFEFF' + csv); // BOM taaki Excel Hindi/special characters sahi dikhaye
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;