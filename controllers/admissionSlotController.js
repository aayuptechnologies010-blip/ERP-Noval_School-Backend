const AdmissionSlot = require('../models/admissionSlotModel');

// @desc Get all admission slots
// @route GET /api/admission-slots
exports.getAllSlots = async (req, res) => {
  try {
    const { session, class: cls } = req.query;
    const filter = {};
    if (session && session !== 'Select Session') filter.session = session;
    if (cls && cls !== 'Select Class' && cls !== 'All') filter.class = cls;
    const slots = await AdmissionSlot.find(filter).sort({ createdAt: -1 });
    res.json(slots);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Create a new slot
// @route POST /api/admission-slots
exports.createSlot = async (req, res) => {
  try {
    const { slotName, session, class: cls, slotDate, startTime, endTime, maxApplicants, location, applicants } = req.body;
    const slot = new AdmissionSlot({
      slotName,
      session: session || '2026-2027',
      class: cls || 'All',
      slotDate: slotDate || new Date().toISOString().split('T')[0],
      startTime: startTime || '09:00 AM',
      endTime: endTime || '11:00 AM',
      maxApplicants: Number(maxApplicants) || 25,
      allottedApplicants: applicants ? applicants.length : 0,
      location: location || 'Room 101 - Main Wing',
      applicants: applicants || []
    });
    const created = await slot.save();
    res.status(201).json(created);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Update points for an applicant in a slot
// @route PUT /api/admission-slots/:id/applicant-points
exports.updateApplicantPoints = async (req, res) => {
  try {
    const { applicantId, points, criteriaPoints } = req.body;
    const slot = await AdmissionSlot.findById(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });

    const applicant = slot.applicants.id(applicantId);
    if (!applicant) return res.status(404).json({ message: 'Applicant not found in slot' });

    if (points !== undefined) applicant.points = Number(points);
    if (criteriaPoints) applicant.criteriaPoints = criteriaPoints;

    await slot.save();
    res.json({ message: 'Points updated successfully', slot });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Re-slot an applicant from source slot to target slot
// @route POST /api/admission-slots/re-slot
exports.reslotApplicant = async (req, res) => {
  try {
    const { sourceSlotId, targetSlotId, applicantId } = req.body;
    const sourceSlot = await AdmissionSlot.findById(sourceSlotId);
    const targetSlot = await AdmissionSlot.findById(targetSlotId);

    if (!sourceSlot || !targetSlot) {
      return res.status(404).json({ message: 'Source or target slot not found' });
    }

    const applicant = sourceSlot.applicants.id(applicantId);
    if (!applicant) {
      return res.status(404).json({ message: 'Applicant not found in source slot' });
    }

    // Add to target slot
    const applicantObj = applicant.toObject();
    delete applicantObj._id;
    targetSlot.applicants.push(applicantObj);
    targetSlot.allottedApplicants = targetSlot.applicants.length;
    await targetSlot.save();

    // Remove from source slot
    sourceSlot.applicants.pull({ _id: applicantId });
    sourceSlot.allottedApplicants = sourceSlot.applicants.length;
    await sourceSlot.save();

    res.json({ message: 'Applicant successfully moved to target slot', sourceSlot, targetSlot });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc Delete a slot
// @route DELETE /api/admission-slots/:id
exports.deleteSlot = async (req, res) => {
  try {
    const slot = await AdmissionSlot.findByIdAndDelete(req.params.id);
    if (!slot) return res.status(404).json({ message: 'Slot not found' });
    res.json({ message: 'Slot deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
