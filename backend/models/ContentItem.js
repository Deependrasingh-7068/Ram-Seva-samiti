const mongoose = require('mongoose');

const ContentItemSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      enum: ['seva', 'events', 'event', 'gallery', 'members', 'member', 'updates', 'update'],
    },
    title: { type: String, required: true, trim: true },
    category: { type: String, default: 'NOTICE' },
    date: { type: String, default: () => new Date().toISOString().split('T')[0] },
    time: { type: String },
    location: { type: String },
    status: { type: String, default: 'Upcoming' },
    subtitle: { type: String },
    titleEnglish: { type: String },
    description: { type: String },
    content: { type: String },
    excerpt: { type: String },
    slug: { type: String },
    icon: { type: String, default: 'hand-heart' },
    image: { type: String, default: '' },
    thumbnail: { type: String, default: '' },
    nameHindi: { type: String },
    nameEnglish: { type: String },
    role: { type: String },
    roleHindi: { type: String },
    roleEnglish: { type: String },
    bio: { type: String },
    phone: { type: String },
    email: { type: String },
    adminName: { type: String, default: 'Admin' },
    createdBy: { type: String, required: true, lowercase: true, trim: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContentItem', ContentItemSchema);