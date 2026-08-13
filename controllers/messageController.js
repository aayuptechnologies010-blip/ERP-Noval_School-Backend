const Message = require('../models/messageModel');
const path = require('path');
const fs = require('fs');

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { subject, body, recipients } = req.body;

    if (!subject || !body || !recipients) {
      return res.status(400).json({ message: 'Please provide subject, body, and recipients' });
    }

    // Parse recipients if it's a stringified array (since we might use multipart/form-data)
    let parsedRecipients = recipients;
    if (typeof recipients === 'string') {
      try {
        parsedRecipients = JSON.parse(recipients);
      } catch (e) {
        // If it's just a single ID string
        parsedRecipients = [recipients];
      }
    }

    let attachmentUrl = null;
    let originalFileName = null;

    if (req.file) {
      attachmentUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      originalFileName = req.file.originalname;
    }

    const message = new Message({
      sender: req.user._id, // Assumes authMiddleware attaches Admin user to req.user
      recipients: parsedRecipients,
      subject,
      body,
      attachment: attachmentUrl,
      originalFileName
    });

    const savedMessage = await message.save();

    res.status(201).json({
      message: 'Message sent successfully',
      data: savedMessage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get sent messages
// @route   GET /api/messages/sent
// @access  Private
const getSentMessages = async (req, res) => {
  try {
    // Find messages where sender is the logged-in user
    const messages = await Message.find({ sender: req.user._id })
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get inbox messages
// @route   GET /api/messages/inbox
// @access  Private
const getInboxMessages = async (req, res) => {
  try {
    // Find messages where the logged-in user is in the recipients array
    const messages = await Message.find({ recipients: req.user._id })
      .populate('sender', 'firstName lastName email')
      .sort({ createdAt: -1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get message by ID
// @route   GET /api/messages/:id
// @access  Private
const getMessageById = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id)
      .populate('sender', 'firstName lastName email');

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only allow sender or recipient to view it
    const isSender = message.sender._id.toString() === req.user._id.toString();
    const isRecipient = message.recipients.includes(req.user._id);

    if (!isSender && !isRecipient) {
      return res.status(403).json({ message: 'Not authorized to view this message' });
    }

    // Mark as read if user is a recipient and viewing it
    if (isRecipient && !message.isRead) {
      message.isRead = true;
      await message.save();
    }

    res.status(200).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete message
// @route   DELETE /api/messages/:id
// @access  Private
const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Optional: Only allow sender to delete, or recipient can delete their copy?
    // Usually, in a simple system, we just allow the sender or a global admin to delete it.
    if (message.sender.toString() !== req.user._id.toString()) {
       return res.status(403).json({ message: 'Not authorized to delete this message' });
    }

    // Delete attachment from server if exists
    if (message.attachment) {
      const filename = message.attachment.split('/').pop();
      const filePath = path.join(__dirname, '..', 'uploads', filename);
      
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    }

    await Message.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendMessage,
  getSentMessages,
  getInboxMessages,
  getMessageById,
  deleteMessage
};
