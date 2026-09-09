const express = require('express');
const router = express.Router();
const BonafideCertificate = require('../models/bonafideCertificateModel');

// GET all Bonafides
router.get('/', async (req, res) => {
  try {
    const { session, search } = req.query;
    const query = {};
    if (session && session !== 'Select Session') query.session = session;
    if (search) {
      query.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { admissionNo: { $regex: search, $options: 'i' } },
        { bonafideNo: { $regex: search, $options: 'i' } }
      ];
    }
    const list = await BonafideCertificate.find(query).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE Bonafide
router.post('/', async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.bonafideNo) {
      const count = await BonafideCertificate.countDocuments();
      data.bonafideNo = `BON/2026/${String(count + 1).padStart(3, '0')}`;
    }
    const doc = new BonafideCertificate(data);
    await doc.save();
    res.status(201).json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE Bonafide
router.put('/:id', async (req, res) => {
  try {
    const doc = await BonafideCertificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!doc) return res.status(404).json({ message: 'Bonafide certificate not found' });
    res.json(doc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE Bonafide
router.delete('/:id', async (req, res) => {
  try {
    const doc = await BonafideCertificate.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ message: 'Bonafide certificate not found' });
    res.json({ message: 'Bonafide certificate deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
