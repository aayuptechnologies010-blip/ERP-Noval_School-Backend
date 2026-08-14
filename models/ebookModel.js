const mongoose = require('mongoose');

const ebookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'E-Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Author or Publisher is required'],
      trim: true,
    },
    className: {
      type: String,
      required: [true, 'Class name is required (e.g., Class 10)'],
      trim: true,
    },
    subject: {
      type: String,
      required: [true, 'Subject is required'],
      trim: true,
    },
    pdfUrl: {
      type: String,
      required: [true, 'PDF download URL is required'],
      trim: true,
    },
    coverImageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for faster searching and filtering
ebookSchema.index({ subject: 1, className: 1 });
ebookSchema.index({ title: 'text', author: 'text' });

const EBook = mongoose.model('EBook', ebookSchema);
module.exports = EBook;
