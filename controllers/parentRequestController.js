const ParentRequest = require('../models/parentRequestModel');

// @desc Get all parent change requests
// @route GET /api/parent-requests
exports.getAllRequests = async (req, res) => {
  try {
    const { status, class: cls } = req.query;
    const filter = {};
    if (status && status !== 'All') filter.status = status;
    if (cls && cls !== 'All') filter.class = cls;
    const list = await ParentRequest.find(filter).sort({ createdAt: -1 });
    res.json(list);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Submit a parent change request
// @route POST /api/parent-requests
exports.createRequest = async (req, res) => {
  try {
    const reqData = req.body;
    const item = new ParentRequest(reqData);
    const saved = await item.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update request status (Approve / Reject)
// @route PUT /api/parent-requests/:id/status
exports.updateRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const item = await ParentRequest.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!item) return res.status(404).json({ message: 'Request not found' });
    res.json(item);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
