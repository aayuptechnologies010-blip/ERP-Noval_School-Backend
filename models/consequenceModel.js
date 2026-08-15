const mongoose = require('mongoose');

const consequenceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Consequence title is required'],
      trim: true
    },
    infractionType: {
      type: String,
      required: [true, 'Infraction type is required'],
      trim: true
    },
    actionType: {
      type: String,
      required: [true, 'Action type is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true
    },
    notifyParent: {
      type: Boolean,
      default: false
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

const Consequence = mongoose.model('Consequence', consequenceSchema);
module.exports = Consequence;
