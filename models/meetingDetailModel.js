const mongoose = require('mongoose');

const meetingDetailSchema = new mongoose.Schema({
  committeeType: {
    type: String,
    required: [true, 'Committee type is required'],
    trim: true
  },
  meetingDate: {
    type: Date,
    required: [true, 'Meeting date is required']
  },
  noOfMembers: {
    type: Number,
    default: 0
  },
  description: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

const MeetingDetail = mongoose.model('MeetingDetail', meetingDetailSchema);

module.exports = MeetingDetail;
