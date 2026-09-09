const express = require('express');
const router = express.Router();
const CbseRegistration = require('../models/cbseRegistrationModel');

// GET CBSE registrations
router.get('/', async (req, res) => {
  try {
    const { session, school, wing, class: cls, section, stream, search } = req.query;
    const query = {};
    if (session && session !== 'Select Session') query.session = session;
    if (school && school !== 'All Schools') query.school = school;
    if (wing && wing !== 'All Wings') query.wing = wing;
    if (cls && cls !== 'Select Classes' && !cls.includes('All')) query.class = cls;
    if (section && section !== 'All Sections') query.section = section;
    if (stream && stream !== 'All Stream') query.stream = stream;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { admissionNo: { $regex: search, $options: 'i' } },
        { regNo: { $regex: search, $options: 'i' } }
      ];
    }
    const list = await CbseRegistration.find(query).sort({ admissionNo: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// BULK SAVE / UPDATE CBSE registrations
router.post('/bulk', async (req, res) => {
  try {
    const { list } = req.body;
    if (!Array.isArray(list)) return res.status(400).json({ message: 'List must be an array' });
    const results = [];
    for (const item of list) {
      if (item._id) {
        const updated = await CbseRegistration.findByIdAndUpdate(item._id, item, { new: true });
        results.push(updated);
      } else {
        const existing = await CbseRegistration.findOne({ admissionNo: item.admissionNo });
        if (existing) {
          Object.assign(existing, item);
          await existing.save();
          results.push(existing);
        } else {
          const newDoc = new CbseRegistration(item);
          await newDoc.save();
          results.push(newDoc);
        }
      }
    }
    res.status(200).json({ message: 'CBSE registrations saved successfully', count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
