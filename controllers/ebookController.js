const EBook = require('../models/ebookModel');

// @desc    Add a new E-Book
// @route   POST /api/ebooks
// @access  Private (Admin/Librarian)
const createEBook = async (req, res) => {
  try {
    const { title, author, className, subject, coverImageUrl } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'PDF file is required.' });
    }

    const pdfUrl = `/uploads/${req.file.filename}`;

    if (!title || !author || !className || !subject) {
      return res.status(400).json({
        message: 'title, author, className, and subject are required.',
      });
    }

    const ebook = new EBook({
      title,
      author,
      className,
      subject,
      pdfUrl,
      coverImageUrl: coverImageUrl || '',
    });

    const savedEBook = await ebook.save();
    res.status(201).json({ message: 'E-Book added successfully', ebook: savedEBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all E-Books (with optional subject filter)
// @route   GET /api/ebooks?subject=Physics
// @access  Private
const getAllEBooks = async (req, res) => {
  try {
    const { subject, className, search } = req.query;
    let query = {};

    if (subject && subject !== 'All Subjects') {
      query.subject = subject;
    }

    if (className) {
      query.className = className;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
      ];
    }

    const ebooks = await EBook.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: ebooks.length,
      records: ebooks,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createEBook,
  getAllEBooks,
};
