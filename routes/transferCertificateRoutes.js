const express = require('express');
const router = express.Router();
const TransferCertificate = require('../models/transferCertificateModel');

// GET all TCs with optional filters
router.get('/', async (req, res) => {
  try {
    const { status, board, session, class: cls, section, search } = req.query;
    const query = {};
    if (status && status !== 'All TC') query.status = status;
    if (board) query.board = board;
    if (session && session !== 'Select Session') query.session = session;
    if (cls && cls !== 'Select Class' && !cls.includes('All')) query.class = cls;
    if (section && section !== 'Select Section' && section !== 'All Section') query.section = section;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { admissionNo: { $regex: search, $options: 'i' } },
        { tcNo: { $regex: search, $options: 'i' } }
      ];
    }
    const tcs = await TransferCertificate.find(query).sort({ createdAt: -1 });
    res.json(tcs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET single TC
router.get('/:id', async (req, res) => {
  try {
    const tc = await TransferCertificate.findById(req.params.id);
    if (!tc) return res.status(404).json({ message: 'TC not found' });
    res.json(tc);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// CREATE TC (Draft or Generated)
router.post('/', async (req, res) => {
  try {
    const data = { ...req.body };
    if (!data.tcNo) {
      const count = await TransferCertificate.countDocuments();
      data.tcNo = `TC-2026-${String(count + 1).padStart(3, '0')}`;
    }
    if (!data.applyDate) {
      data.applyDate = new Date().toLocaleDateString('en-GB');
    }
    const tc = new TransferCertificate(data);
    await tc.save();
    res.status(201).json(tc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE TC
router.put('/:id', async (req, res) => {
  try {
    const tc = await TransferCertificate.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!tc) return res.status(404).json({ message: 'TC not found' });
    res.json(tc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// GENERATE TC (Transitions Draft -> Generated)
router.put('/:id/generate', async (req, res) => {
  try {
    const tc = await TransferCertificate.findById(req.params.id);
    if (!tc) return res.status(404).json({ message: 'TC not found' });
    tc.status = 'Generated';
    tc.issueDate = new Date().toLocaleDateString('en-GB');
    if (!tc.tcNo || tc.tcNo.startsWith('DRAFT')) {
      const count = await TransferCertificate.countDocuments({ status: 'Generated' });
      tc.tcNo = `TC-2026-${String(count + 1).padStart(3, '0')}`;
    }
    await tc.save();
    res.json(tc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// CANCEL TC
router.put('/:id/cancel', async (req, res) => {
  try {
    const { cancelReason } = req.body;
    const tc = await TransferCertificate.findById(req.params.id);
    if (!tc) return res.status(404).json({ message: 'TC not found' });
    tc.status = 'Cancelled';
    tc.cancelDate = new Date().toLocaleDateString('en-GB');
    tc.cancelReason = cancelReason || 'Cancelled on parent request';
    await tc.save();
    res.json(tc);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE TC
router.delete('/:id', async (req, res) => {
  try {
    const tc = await TransferCertificate.findByIdAndDelete(req.params.id);
    if (!tc) return res.status(404).json({ message: 'TC not found' });
    res.json({ message: 'TC record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// BULK TC create / update (for TC Form Class Wise & Generate TC In Bulk)
router.post('/bulk', async (req, res) => {
  try {
    const { list, mode } = req.body;
    if (!Array.isArray(list)) return res.status(400).json({ message: 'List must be an array' });
    const results = [];
    for (const item of list) {
      if (item._id) {
        const updated = await TransferCertificate.findByIdAndUpdate(item._id, item, { new: true });
        results.push(updated);
      } else {
        const existing = await TransferCertificate.findOne({ admissionNo: item.admissionNo });
        if (existing) {
          Object.assign(existing, item);
          if (mode === 'Generated TC') {
            existing.status = 'Generated';
            existing.issueDate = existing.issueDate || new Date().toLocaleDateString('en-GB');
          }
          await existing.save();
          results.push(existing);
        } else {
          const newDoc = new TransferCertificate({
            ...item,
            status: mode === 'Generated TC' ? 'Generated' : 'Draft',
            issueDate: mode === 'Generated TC' ? new Date().toLocaleDateString('en-GB') : ''
          });
          await newDoc.save();
          results.push(newDoc);
        }
      }
    }
    res.status(200).json({ message: 'Bulk TC processed successfully', count: results.length, data: results });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
