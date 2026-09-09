const mongoose = require('mongoose');

const subjectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Subject name is required'],
    trim: true,
    uppercase: true
  },
  abbrev: {
    type: String,
    trim: true,
    uppercase: true
  },
  type: {
    type: String,
    enum: ['Major', 'Minor', 'Main', 'Optional', 'Co-scholastic', 'Other'],
    default: 'Major'
  },
  color: {
    type: String,
    default: '#ffffff'
  },
  code: {
    type: String,
    trim: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    default: null
  },
  library: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const Subject = mongoose.model('Subject', subjectSchema);

module.exports = Subject;
