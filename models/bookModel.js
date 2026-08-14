const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema(
  {
    accNo: {
      type: String,
      required: [true, 'Accession number is required'],
      unique: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Book title is required'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Book author is required'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: ['Available', 'Issued', 'Requested'],
      default: 'Available',
    },
    issuedTo: {
      type: mongoose.Schema.Types.ObjectId, // Could be Student or Staff, keeping it generic
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for fast searching
bookSchema.index({ title: 'text', author: 'text', accNo: 'text' });
bookSchema.index({ status: 1 });

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;
