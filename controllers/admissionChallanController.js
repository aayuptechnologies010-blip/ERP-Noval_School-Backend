const AdmissionChallan = require('../models/admissionChallanModel');

// @desc Get all challans
// @route GET /api/admission-challans
exports.getAllChallans = async (req, res) => {
  try {
    const { class: cls, search } = req.query;
    const filter = {};
    if (cls && cls !== 'All') filter.class = cls;
    if (search) {
      filter.$or = [
        { studentName: { $regex: search, $options: 'i' } },
        { admissionNo: { $regex: search, $options: 'i' } },
        { challanNo: { $regex: search, $options: 'i' } }
      ];
    }
    const list = await AdmissionChallan.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Generate new challan
// @route POST /api/admission-challans
exports.createChallan = async (req, res) => {
  try {
    const challanData = req.body;
    if (!challanData.challanNo) {
      challanData.challanNo = 'CHL-' + Date.now().toString().slice(-7);
    }
    const challan = new AdmissionChallan(challanData);
    const saved = await challan.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
