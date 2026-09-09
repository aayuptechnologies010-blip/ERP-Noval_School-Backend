const express = require('express');
const router = express.Router();
const CbseExamConfirmation = require('../models/cbseExamConfirmationModel');

// GET CBSE Exam Confirmations
router.get('/', async (req, res) => {
  try {
    const { examinationYear, school, class: cls, section, search } = req.query;
    const query = {};
    if (examinationYear) query.examinationYear = examinationYear;
    if (school && school !== 'All Schools') query.school = school;
    if (cls && cls !== 'Select Classes' && !cls.includes('All')) query.class = cls;
    if (section && section !== 'All Sections') query.section = section;
    if (search) {
      query.$or = [
        { candidateName: { $regex: search, $options: 'i' } },
        { admissionNo: { $regex: search, $options: 'i' } },
        { rollNo: { $regex: search, $options: 'i' } }
      ];
    }
    const list = await CbseExamConfirmation.find(query).sort({ rollNo: 1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// BULK SAVE / UPDATE CBSE Exam Confirmations
router.post('/bulk', async (req, res) => {
  try {
    const { list } = req.body;
    if (!Array.isArray(list)) return res.status(400).json({ message: 'List must be an array' });
    const results = [];
    for (const item of list) {
      if (item._id) {
        const updated = await CbseExamConfirmation.findByIdAndUpdate(item._id, item, { new: true });
        results.push(updated);
      } else {
        const existing = await CbseExamConfirmation.findOne({ admissionNo: item.admissionNo });
        if (existing) {
          Object.assign(existing, item);
          await existing.save();
          results.push(existing);
        } else {
          const newDoc = new CbseExamConfirmation(item);
          await newDoc.save();
          results.push(newDoc);
        }
      }
    }
    res.status(200).json({ message: 'CBSE Exam Confirmations saved successfully', count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
