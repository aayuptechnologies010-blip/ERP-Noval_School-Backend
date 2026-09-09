const { AdmissionFee, AdmissionAmtStructure } = require('../models/admissionFeeModel');

// @desc Get all collected admission fees
// @route GET /api/admission-fees
exports.getAllFees = async (req, res) => {
  try {
    const { search, class: cls } = req.query;
    const filter = {};
    if (cls && cls !== 'All') filter.class = cls;
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { admissionNo: { $regex: search, $options: 'i' } },
        { receiptNo: { $regex: search, $options: 'i' } }
      ];
    }
    const list = await AdmissionFee.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Collect admission fee
// @route POST /api/admission-fees
exports.collectFee = async (req, res) => {
  try {
    const feeData = req.body;
    if (!feeData.receiptNo) {
      feeData.receiptNo = 'REC-' + Date.now().toString().slice(-6);
    }
    const fee = new AdmissionFee(feeData);
    const saved = await fee.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Get amount structures
// @route GET /api/admission-fees/structures
exports.getAllStructures = async (req, res) => {
  try {
    const { class: cls, session } = req.query;
    const filter = {};
    if (cls && cls !== 'All') filter.class = cls;
    if (session) filter.session = session;
    const list = await AdmissionAmtStructure.find(filter);
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Save amount structure
// @route POST /api/admission-fees/structures
exports.saveStructure = async (req, res) => {
  try {
    const { class: cls, session, feeType, heads, totalAmount } = req.body;
    let structure = await AdmissionAmtStructure.findOne({ class: cls, session: session || '2026-2027' });
    if (structure) {
      structure.heads = heads;
      structure.totalAmount = totalAmount || heads.reduce((sum, h) => sum + (Number(h.amount) || 0), 0);
      structure.feeType = feeType || 'Regular';
      await structure.save();
    } else {
      structure = new AdmissionAmtStructure({
        class: cls,
        session: session || '2026-2027',
        feeType: feeType || 'Regular',
        heads,
        totalAmount: totalAmount || heads.reduce((sum, h) => sum + (Number(h.amount) || 0), 0)
      });
      await structure.save();
    }
    res.status(201).json(structure);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
