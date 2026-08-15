const mongoose = require('mongoose');

const thoughtSchema = new mongoose.Schema(
  {
    thought: {
      type: String,
      required: [true, 'Thought text is required'],
      trim: true
    },
    author: {
      type: String,
      required: [true, 'Author name is required'],
      trim: true
    },
    date: {
      type: Date,
      required: [true, 'Date is required']
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

const Thought = mongoose.model('Thought', thoughtSchema);
module.exports = Thought;
