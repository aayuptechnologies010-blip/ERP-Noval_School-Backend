const ProspectusSettlement = require('../models/prospectusSettlementModel');

// @desc Get all prospectus settlements
// @route GET /api/prospectus-settlements
exports.getAllSettlements = async (req, res) => {
  try {
    const { fromDate, toDate, search } = req.query;
    const filter = {};
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { prospectusNo: { $regex: search, $options: 'i' } },
        { admissionNo: { $regex: search, $options: 'i' } }
      ];
    }
    const list = await ProspectusSettlement.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Settle a prospectus
// @route POST /api/prospectus-settlements
exports.createSettlement = async (req, res) => {
  try {
    const settlementData = req.body;
    if (!settlementData.prospectusNo) {
      settlementData.prospectusNo = 'PR-' + Date.now().toString().slice(-6);
    }
    const settlement = new ProspectusSettlement(settlementData);
    const saved = await settlement.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
