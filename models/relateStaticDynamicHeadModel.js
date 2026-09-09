const mongoose = require('mongoose');

const relateStaticDynamicHeadSchema = new mongoose.Schema({
  staticHead: {
    type: String,
    required: [true, 'Static head name is required'],
    unique: true,
    trim: true
  },
  dynamicHead: {
    type: String,
    default: 'NA',
    trim: true
  },
  selected: {
    type: Boolean,
    default: false
  },
  highlighted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('RelateStaticDynamicHead', relateStaticDynamicHeadSchema);
