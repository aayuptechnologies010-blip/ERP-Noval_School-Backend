const mongoose = require('mongoose');

// 1. LFD Album Configuration Schema
const lfdAlbumConfigSchema = new mongoose.Schema({
  method: {
    type: String,
    enum: ['latest', 'manual'],
    default: 'latest'
  },
  albumId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Album'
  },
  albumTitle: {
    type: String,
    default: ''
  },
  selectedPhotos: [{
    type: String
  }],
  slideDuration: {
    type: Number,
    default: 5 // seconds
  },
  transitionEffect: {
    type: String,
    default: 'Fade'
  },
  showTitle: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// 2. LFD Flyer Schema
const lfdFlyerSchema = new mongoose.Schema({
  flyerName: {
    type: String,
    required: true
  },
  activationDate: {
    type: Date,
    default: Date.now
  },
  deactivationDate: {
    type: Date
  },
  displayOrder: {
    type: Number,
    default: 1
  },
  flyerImage: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'Active'
  }
}, {
  timestamps: true
});

// 3. LFD Notice Schema
const lfdNoticeSchema = new mongoose.Schema({
  noticeHeading: {
    type: String,
    required: true
  },
  noticeDate: {
    type: Date,
    default: Date.now
  },
  description: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'Active'
  },
  showOnFooter: {
    type: Boolean,
    default: false
  },
  displayOrder: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// 4. LFD Topper Schema
const lfdTopperSchema = new mongoose.Schema({
  academicYear: {
    type: String,
    default: '2026-2027'
  },
  studentClass: {
    type: String,
    default: 'Class X'
  },
  studentName: {
    type: String,
    required: true
  },
  displayOrder: {
    type: Number,
    default: 1
  },
  description: {
    type: String,
    default: ''
  },
  photoUrl: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    default: 'Active'
  }
}, {
  timestamps: true
});

const LfdAlbumConfig = mongoose.model('LfdAlbumConfig', lfdAlbumConfigSchema);
const LfdFlyer = mongoose.model('LfdFlyer', lfdFlyerSchema);
const LfdNotice = mongoose.model('LfdNotice', lfdNoticeSchema);
const LfdTopper = mongoose.model('LfdTopper', lfdTopperSchema);

module.exports = {
  LfdAlbumConfig,
  LfdFlyer,
  LfdNotice,
  LfdTopper
};
