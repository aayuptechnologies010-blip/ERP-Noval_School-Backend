const Album = require('../models/albumModel');

// Helper to get uploaded file URL
const getFileUrl = (req, fieldName) => {
  if (req.file && req.file.fieldname === fieldName) {
    return `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
  }
  return '';
};

// @desc    Create a new album
// @route   POST /api/albums
// @access  Private (Admin)
const createAlbum = async (req, res) => {
  try {
    let albumData = req.body;
    if (req.body.data) {
      albumData = JSON.parse(req.body.data);
    }

    const album = new Album(albumData);

    // Attach cover image if uploaded
    if (req.file) {
      album.coverImage = getFileUrl(req, 'coverImage');
    }

    const savedAlbum = await album.save();
    res.status(201).json(savedAlbum);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all albums
// @route   GET /api/albums
// @access  Private (Admin)
const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.find({});
    res.json(albums);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get album by ID
// @route   GET /api/albums/:id
// @access  Private (Admin)
const getAlbumById = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);
    if (album) {
      res.json(album);
    } else {
      res.status(404).json({ message: 'Album not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update an album
// @route   PUT /api/albums/:id
// @access  Private (Admin)
const updateAlbum = async (req, res) => {
  try {
    let albumData = req.body;
    if (req.body.data) {
      albumData = JSON.parse(req.body.data);
    }

    const album = await Album.findById(req.params.id);

    if (album) {
      // Update fields
      album.title = albumData.title || album.title;
      album.eventDate = albumData.eventDate || album.eventDate;
      album.totalMemories = albumData.totalMemories !== undefined ? albumData.totalMemories : album.totalMemories;
      album.isActive = albumData.isActive !== undefined ? albumData.isActive : album.isActive;

      // Update image if a new one is uploaded
      if (req.file) {
        album.coverImage = getFileUrl(req, 'coverImage');
      }

      const updatedAlbum = await album.save();
      res.json(updatedAlbum);
    } else {
      res.status(404).json({ message: 'Album not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an album
// @route   DELETE /api/albums/:id
// @access  Private (Admin)
const deleteAlbum = async (req, res) => {
  try {
    const album = await Album.findByIdAndDelete(req.params.id);

    if (album) {
      res.json({ message: 'Album removed successfully' });
    } else {
      res.status(404).json({ message: 'Album not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Toggle an album's active status
// @route   PATCH /api/albums/:id/status
// @access  Private (Admin)
const toggleAlbumStatus = async (req, res) => {
  try {
    const album = await Album.findById(req.params.id);

    if (album) {
      album.isActive = !album.isActive;
      const updatedAlbum = await album.save();
      res.json({ message: `Album status updated to ${updatedAlbum.isActive ? 'Active' : 'Inactive'}`, isActive: updatedAlbum.isActive });
    } else {
      res.status(404).json({ message: 'Album not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAlbum,
  getAllAlbums,
  getAlbumById,
  updateAlbum,
  deleteAlbum,
  toggleAlbumStatus
};
