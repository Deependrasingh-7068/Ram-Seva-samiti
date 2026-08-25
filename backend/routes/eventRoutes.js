const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    location: { type: String, required: true },
    status: { type: String, default: 'Upcoming' },
    image: { type: String, default: '' },
    adminName: { type: String, default: 'Admin' },
    createdBy: { type: String, default: '' },
  },
  { timestamps: true, collection: 'events' }
);

if (mongoose.models.Event) {
  delete mongoose.models.Event;
}
const Event = mongoose.model('Event', EventSchema);

// GET ALL EVENTS
router.get('/all', async (req, res) => {
  try {
    const events = await Event.find().sort({ createdAt: -1 });
    return res.json({ success: true, items: events });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// SAVE / ADD EVENT
router.post('/save', async (req, res) => {
  try {
    const { title, category, date, time, location, status, image, adminName, createdBy } = req.body;
    
    const newEvent = new Event({
      title,
      category,
      date,
      time,
      location,
      status: status || 'Upcoming',
      image,
      adminName,
      createdBy,
    });

    const savedEvent = await newEvent.save();
    return res.status(201).json({ success: true, item: savedEvent });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// UPDATE EVENT (used for edit + auto Upcoming->Ongoing status flip)
router.put('/:id', async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Event not found' });
    }
    return res.json({ success: true, item: updated });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE EVENT
router.delete('/delete/:id', async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    return res.json({ success: true, message: 'Event deleted successfully' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;