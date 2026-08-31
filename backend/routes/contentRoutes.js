const express = require('express');
const router = express.Router();
const ContentItem = require('../models/ContentItem');
const Member = require('../models/Member');
const User = require('../models/User'); // Required to check frozen admin status
const OfficeBearer = require('../models/OfficeBearer'); // Required to check frozen office bearer status

// 1. PUBLIC ROUTE: Returns all content for public pages (Excluding frozen admins'/office bearers' content)
router.get('/public-all/:type', async (req, res) => {
  try {
    const rawType = req.params.type.toLowerCase().trim();
    const typeQueries = [rawType];
    if (rawType.endsWith('s')) {
      typeQueries.push(rawType.slice(0, -1));
    } else {
      typeQueries.push(`${rawType}s`);
    }

    // Fetch all frozen admins AND frozen office bearers to hide their posted content temporarily
    const [frozenAdmins, frozenBearers] = await Promise.all([
      User.find({ isFrozen: true }),
      OfficeBearer.find({ isFrozen: true }),
    ]);
    const frozenEmails = [
      ...frozenAdmins.map(a => (a.email || '').toLowerCase().trim()),
      ...frozenBearers.map(b => (b.email || '').toLowerCase().trim()),
    ];
    const frozenNames = [
      ...frozenAdmins.map(a => (a.name || '').toLowerCase().trim()),
      ...frozenBearers.map(b => (b.nameHindi || '').toLowerCase().trim()),
      ...frozenBearers.map(b => (b.nameEnglish || '').toLowerCase().trim()),
    ];

    // Helper filter function to check if item creator is frozen
    const isNotFrozen = (item) => {
      const creator = (item.createdBy || '').toLowerCase().trim();
      const admName = (item.adminName || '').toLowerCase().trim();
      if (frozenEmails.includes(creator) || frozenNames.includes(admName)) {
        return false; // Hide this item
      }
      return true;
    };

    if (rawType === 'member' || rawType === 'members') {
      let items = await Member.find({}).sort({ createdAt: -1 });
      items = items.filter(isNotFrozen);
      return res.json({ success: true, items });
    }

    let items = await ContentItem.find({ type: { $in: typeQueries } }).sort({ createdAt: -1 });
    items = items.filter(isNotFrozen);

    res.json({ success: true, items });
  } catch (err) {
    console.error('Public all error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 2. ADMIN ROUTE: Filter items by logged-in admin
router.get('/my-items/:type/:adminEmail', async (req, res) => {
  try {
    const rawType = req.params.type.toLowerCase().trim();
    const typeQueries = [rawType];
    if (rawType.endsWith('s')) {
      typeQueries.push(rawType.slice(0, -1));
    } else {
      typeQueries.push(`${rawType}s`);
    }

    if (rawType === 'member' || rawType === 'members') {
      const items = await Member.find({}).sort({ createdAt: -1 });
      return res.json({ success: true, items });
    }

    const email = (req.params.adminEmail || '').toLowerCase().trim();

    const items = await ContentItem.find({
      type: { $in: typeQueries },
      $or: [
        { createdBy: email },
        { adminName: new RegExp(email.split('@')[0], 'i') },
        { createdBy: new RegExp(email.split('@')[0], 'i') }
      ],
    }).sort({ createdAt: -1 });

    res.json({ success: true, items });
  } catch (err) {
    console.error('My items error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 3. CREATE ITEM: Cleans temp frontend IDs and safely inserts
router.post('/add', async (req, res) => {
  try {
    const bodyData = { ...req.body };

    delete bodyData._id;
    delete bodyData.id;

    const {
      type,
      title,
      category,
      date,
      description,
      content,
      excerpt,
      adminName,
      createdBy,
      ...rest
    } = bodyData;

    if (!type) {
      return res.status(400).json({ success: false, message: 'Type is required' });
    }

    const normalizedType = type.toLowerCase().trim();

    // Member Model Save
    if (normalizedType === 'member' || normalizedType === 'members') {
      const hindiName = bodyData.nameHindi || bodyData.title || 'समिति सदस्य';
      const englishName = bodyData.nameEnglish || '';
      const memberBio = bodyData.bio || bodyData.description || '';
      const finalRoleEnglish = bodyData.roleEnglish || bodyData.role || bodyData.designation || 'Member';
      const finalRoleHindi = bodyData.roleHindi || bodyData.designationHindi || 'सदस्य';

      const newMember = new Member({
        nameHindi: hindiName,
        name: englishName || hindiName,
        nameEnglish: englishName,
        roleHindi: finalRoleHindi,
        roleEnglish: finalRoleEnglish,
        role: finalRoleEnglish,
        designation: finalRoleEnglish,
        designationHindi: finalRoleHindi,
        phone: bodyData.phone || '',
        email: bodyData.email || '',
        aadhar: bodyData.aadhar || '',
        dob: bodyData.dob || '',
        bio: memberBio,
        description: memberBio,
        image: bodyData.image || bodyData.photo || '',
        photo: bodyData.photo || bodyData.image || '',
        adminName: adminName || 'Admin',
        createdBy: (createdBy || '').toLowerCase().trim()
      });

      const savedMember = await newMember.save();
      return res.status(201).json({ success: true, item: savedMember });
    }

    if (!title) {
      return res.status(400).json({ success: false, message: 'Title is required' });
    }

    const finalDesc = description || content || excerpt || '';
    const finalExcerpt = excerpt || description || content || '';
    const finalContent = content || description || excerpt || '';

    const newItem = new ContentItem({
      ...rest,
      type: normalizedType,
      title: title.trim(),
      category: category || 'NOTICE',
      date: date || new Date().toISOString().split('T')[0],
      description: finalDesc,
      excerpt: finalExcerpt,
      content: finalContent,
      adminName: adminName || 'Admin',
      createdBy: (createdBy || '').toLowerCase().trim(),
    });

    const savedItem = await newItem.save();
    return res.status(201).json({ success: true, item: savedItem });
  } catch (err) {
    console.error('MongoDB Save Error (/api/content/add):', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// 4. UPDATE ITEM
router.put('/update/:id', async (req, res) => {
  try {
    const bodyData = { ...req.body };
    delete bodyData._id;
    delete bodyData.id;

    if (bodyData.nameHindi && !bodyData.name) {
      bodyData.name = bodyData.nameEnglish || bodyData.nameHindi;
    }

    if (bodyData.bio && !bodyData.description) {
      bodyData.description = bodyData.bio;
    } else if (bodyData.description && !bodyData.bio) {
      bodyData.bio = bodyData.description;
    }

    let updated = await ContentItem.findByIdAndUpdate(req.params.id, bodyData, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      updated = await Member.findByIdAndUpdate(req.params.id, bodyData, {
        new: true,
        runValidators: true,
      });
    }

    res.json({ success: true, item: updated });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 5. DELETE ITEM
router.delete('/delete/:id', async (req, res) => {
  try {
    let deleted = await ContentItem.findByIdAndDelete(req.params.id);
    if (!deleted) {
      deleted = await Member.findByIdAndDelete(req.params.id);
    }
    res.json({ success: true, message: 'Item deleted from database' });
  } catch (err) {
    console.error('Delete error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;