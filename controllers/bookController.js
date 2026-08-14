const Book = require('../models/bookModel');

// @desc    Create a new book
// @route   POST /api/books
// @access  Private (Admin/Librarian)
const createBook = async (req, res) => {
  try {
    const { accNo, title, author, category } = req.body;

    if (!accNo || !title || !author || !category) {
      return res.status(400).json({ message: 'accNo, title, author, and category are required.' });
    }

    const existingBook = await Book.findOne({ accNo });
    if (existingBook) {
      return res.status(400).json({ message: 'Book with this Accession Number already exists.' });
    }

    const book = new Book({
      accNo,
      title,
      author,
      category,
    });

    const savedBook = await book.save();
    res.status(201).json({ message: 'Book added successfully', book: savedBook });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all books (with search and status filter)
// @route   GET /api/books?status=Available&search=Physics
// @access  Private
const getAllBooks = async (req, res) => {
  try {
    const { status, search } = req.query;
    let query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { accNo: { $regex: search, $options: 'i' } },
      ];
    }

    const books = await Book.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: books.length,
      records: books,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Request a book
// @route   PATCH /api/books/:id/request
// @access  Private
const requestBook = async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);

    if (!book) {
      return res.status(404).json({ message: 'Book not found.' });
    }

    if (book.status !== 'Available') {
      return res.status(400).json({ message: 'Book is not available for request.' });
    }

    book.status = 'Requested';
    book.issuedTo = req.user?._id || null; // Track who requested it
    
    const updatedBook = await book.save();

    res.json({
      message: 'Book requested successfully',
      book: updatedBook,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createBook,
  getAllBooks,
  requestBook,
};
