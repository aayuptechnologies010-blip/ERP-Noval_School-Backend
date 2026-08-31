const Stream = require('../models/streamModel');

// @desc    Create a new stream
// @route   POST /api/streams
// @access  Private
const createStream = async (req, res) => {
  try {
    const { streamName } = req.body;

    if (!streamName) {
      return res.status(400).json({ message: 'Stream name is required' });
    }

    const streamExists = await Stream.findOne({ streamName: streamName.toUpperCase() });

    if (streamExists) {
      return res.status(400).json({ message: 'Stream already exists' });
    }

    const stream = await Stream.create({
      streamName: streamName.toUpperCase()
    });

    res.status(201).json(stream);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all streams
// @route   GET /api/streams
// @access  Private
const getStreams = async (req, res) => {
  try {
    const streams = await Stream.find({}).sort({ createdAt: -1 });
    res.status(200).json(streams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get stream by ID
// @route   GET /api/streams/:id
// @access  Private
const getStreamById = async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);
    if (!stream) {
      return res.status(404).json({ message: 'Stream not found' });
    }
    res.status(200).json(stream);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a stream
// @route   PUT /api/streams/:id
// @access  Private
const updateStream = async (req, res) => {
  try {
    const { streamName, isActive } = req.body;
    const stream = await Stream.findById(req.params.id);

    if (!stream) {
      return res.status(404).json({ message: 'Stream not found' });
    }

    if (streamName && streamName.toUpperCase() !== stream.streamName) {
      const streamExists = await Stream.findOne({ streamName: streamName.toUpperCase() });
      if (streamExists) {
        return res.status(400).json({ message: 'Stream name already in use' });
      }
    }

    if (streamName) stream.streamName = streamName.toUpperCase();
    if (isActive !== undefined) stream.isActive = isActive;

    const updatedStream = await stream.save();
    res.status(200).json(updatedStream);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a stream
// @route   DELETE /api/streams/:id
// @access  Private
const deleteStream = async (req, res) => {
  try {
    const stream = await Stream.findById(req.params.id);

    if (!stream) {
      return res.status(404).json({ message: 'Stream not found' });
    }

    await stream.deleteOne();
    res.status(200).json({ message: 'Stream removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createStream,
  getStreams,
  getStreamById,
  updateStream,
  deleteStream
};
