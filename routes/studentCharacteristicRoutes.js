const express = require('express');
const router = express.Router();
const StudentCharacteristic = require('../models/studentCharacteristicModel');

// GET all characteristics with filters
router.get('/', async (req, res) => {
  try {
    const { session, class: cls, section, search } = req.query;
    const query = {};
    if (session && session !== 'Select Session') query.session = session;
    if (cls && cls !== 'Select Class' && !cls.includes('All')) query.class = cls;
    if (section && section !== 'Select Section' && section !== 'All Section') query.section = section;
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { admissionNo: { $regex: search, $options: 'i' } }
      ];
    }
    const list = await StudentCharacteristic.find(query).sort({ admissionNo: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// BULK SAVE / UPDATE characteristics
router.post('/bulk', async (req, res) => {
  try {
    const { list } = req.body;
    if (!Array.isArray(list)) return res.status(400).json({ message: 'List must be an array' });
    const results = [];
    for (const item of list) {
      if (item._id) {
        const updated = await StudentCharacteristic.findByIdAndUpdate(item._id, item, { new: true });
        results.push(updated);
      } else {
        const existing = await StudentCharacteristic.findOne({ admissionNo: item.admissionNo });
        if (existing) {
          Object.assign(existing, item);
          await existing.save();
          results.push(existing);
        } else {
          const newDoc = new StudentCharacteristic(item);
          await newDoc.save();
          results.push(newDoc);
        }
      }
    }
    res.status(200).json({ message: 'Characteristics saved successfully', count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
