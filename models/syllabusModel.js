const mongoose = require('mongoose');

const syllabusSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Syllabus title is required'],
      trim: true
    },
    class: {
      type: String,
      required: [true, 'Class is required'],
      trim: true
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true
    },
    fileUrl: {
      type: String,
      required: [true, 'Syllabus file is required']
    },
    originalFileName: {
      type: String
    },
    uploadedBy: {
      type: String,
      default: 'Admin'
    }
  },
  {
    timestamps: true
  }
);

const Syllabus = mongoose.model('Syllabus', syllabusSchema);
module.exports = Syllabus;
