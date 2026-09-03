const SlotCreation = require('../models/slotCreationModel');
const ProspectusEntry = require('../models/prospectusEntryModel'); // Assuming applicants are here

// @desc    Get total applicants for slot creation
// @route   GET /api/slot-creations/total-applicants
// @access  Private
const getTotalApplicants = async (req, res) => {
  try {
    const { session, studentClass, tillDate } = req.query;
    
    if (!session || !studentClass || !tillDate) {
      return res.status(400).json({ message: 'Session, Class, and Till Date are required' });
    }

    // Convert tillDate to end of the day
    const endDate = new Date(tillDate);
    endDate.setUTCHours(23, 59, 59, 999);

    const count = await ProspectusEntry.countDocuments({
      session,
      studentClass,
      date: { $lte: endDate }
    });

    res.status(200).json({ totalStudent: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create new slot(s)
// @route   POST /api/slot-creations
// @access  Private
const createSlot = async (req, res) => {
  try {
    const data = req.body;
    
    // Support bulk creation if data is an array
    if (Array.isArray(data)) {
      const slots = await SlotCreation.insertMany(data);
      return res.status(201).json(slots);
    }
    
    // Single creation
    const slot = await SlotCreation.create(data);
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get slots
// @route   GET /api/slot-creations
// @access  Private
const getSlots = async (req, res) => {
  try {
    const filter = {};
    if (req.query.session) filter.session = req.query.session;
    if (req.query.studentClass) filter.studentClass = req.query.studentClass;
    
    const slots = await SlotCreation.find(filter).populate('session', 'name').sort({ createdAt: -1 });
    res.status(200).json(slots);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get slot by ID
// @route   GET /api/slot-creations/:id
// @access  Private
const getSlotById = async (req, res) => {
  try {
    const slot = await SlotCreation.findById(req.params.id).populate('session', 'name');
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    res.status(200).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a slot
// @route   PUT /api/slot-creations/:id
// @access  Private
const updateSlot = async (req, res) => {
  try {
    const slot = await SlotCreation.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    res.status(200).json(slot);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a slot
// @route   DELETE /api/slot-creations/:id
// @access  Private
const deleteSlot = async (req, res) => {
  try {
    const slot = await SlotCreation.findByIdAndDelete(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    res.status(200).json({ message: 'Slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTotalApplicants,
  createSlot,
  getSlots,
  getSlotById,
  updateSlot,
  deleteSlot
};
