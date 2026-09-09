const mongoose = require('mongoose');

const stationaryDetailsSchema = new mongoose.Schema({
  stationaryName: {
    type: String,
    required: [true, 'Stationary Name is required'],
    trim: true
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: 0
  },
  postAccountName: {
    type: String,
    required: [true, 'Post Account Name is required'],
    trim: true
  },
  school: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SchoolGlobalDetails',
    required: [true, 'School is required']
  },
  session: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AcademicYear',
    required: [true, 'Session is required']
  }
}, {
  timestamps: true
});

const StationaryDetails = mongoose.model('StationaryDetails', stationaryDetailsSchema);

module.exports = StationaryDetails;
