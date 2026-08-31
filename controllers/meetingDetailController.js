const MeetingDetail = require('../models/meetingDetailModel');

// @desc    Create a new meeting detail
// @route   POST /api/meeting-details
// @access  Private
const createMeetingDetail = async (req, res) => {
  try {
    const { committeeType, meetingDate, noOfMembers, description } = req.body;

    if (!committeeType || !meetingDate) {
      return res.status(400).json({ message: 'Committee type and meeting date are required' });
    }

    const meetingDetail = await MeetingDetail.create({
      committeeType,
      meetingDate,
      noOfMembers: noOfMembers || 0,
      description
    });

    res.status(201).json(meetingDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all meeting details
// @route   GET /api/meeting-details
// @access  Private
const getMeetingDetails = async (req, res) => {
  try {
    const meetingDetails = await MeetingDetail.find({}).sort({ meetingDate: -1, createdAt: -1 });
    res.status(200).json(meetingDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get meeting detail by ID
// @route   GET /api/meeting-details/:id
// @access  Private
const getMeetingDetailById = async (req, res) => {
  try {
    const meetingDetail = await MeetingDetail.findById(req.params.id);
    if (!meetingDetail) {
      return res.status(404).json({ message: 'Meeting detail not found' });
    }
    res.status(200).json(meetingDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a meeting detail
// @route   PUT /api/meeting-details/:id
// @access  Private
const updateMeetingDetail = async (req, res) => {
  try {
    const { committeeType, meetingDate, noOfMembers, description } = req.body;
    const meetingDetail = await MeetingDetail.findById(req.params.id);

    if (!meetingDetail) {
      return res.status(404).json({ message: 'Meeting detail not found' });
    }

    if (committeeType) meetingDetail.committeeType = committeeType;
    if (meetingDate) meetingDetail.meetingDate = meetingDate;
    if (noOfMembers !== undefined) meetingDetail.noOfMembers = noOfMembers;
    if (description !== undefined) meetingDetail.description = description;

    const updatedMeetingDetail = await meetingDetail.save();
    res.status(200).json(updatedMeetingDetail);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a meeting detail
// @route   DELETE /api/meeting-details/:id
// @access  Private
const deleteMeetingDetail = async (req, res) => {
  try {
    const meetingDetail = await MeetingDetail.findById(req.params.id);

    if (!meetingDetail) {
      return res.status(404).json({ message: 'Meeting detail not found' });
    }

    await meetingDetail.deleteOne();
    res.status(200).json({ message: 'Meeting detail removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createMeetingDetail,
  getMeetingDetails,
  getMeetingDetailById,
  updateMeetingDetail,
  deleteMeetingDetail
};
