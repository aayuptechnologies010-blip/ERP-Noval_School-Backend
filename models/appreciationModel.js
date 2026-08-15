const mongoose = require('mongoose');

const appreciationSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true
    },
    points: {
      type: Number,
      required: [true, 'Points are required']
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

const Appreciation = mongoose.model('Appreciation', appreciationSchema);
module.exports = Appreciation;
