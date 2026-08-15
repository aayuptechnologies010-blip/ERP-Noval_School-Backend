const mongoose = require('mongoose');

const rewardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Reward title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    value: {
      type: Number,
      required: [true, 'Value is required (use 0 for non-monetary)']
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  },
  {
    timestamps: true
  }
);

const Reward = mongoose.model('Reward', rewardSchema);
module.exports = Reward;
