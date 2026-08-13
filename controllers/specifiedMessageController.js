const SpecifiedMessage = require('../models/specifiedMessageModel');
const MessageTemplate = require('../models/messageTemplateModel');
const Student = require('../models/studentModel');
const path = require('path');
const fs = require('fs');

// @desc    Get contacts (students/parents) based on class
// @route   GET /api/specified-messages/contacts
// @access  Private
const getContacts = async (req, res) => {
  try {
    const { class: className } = req.query;
    
    let query = {};
    if (className) {
      query['academicDetails.class'] = className;
    }

    const students = await Student.find(query);

    // Format response to match the UI table requirements
    const contacts = students.map((student, index) => {
      // Safely extract father's name as primary recipient, fallback to mother or guardian
      let recipientName = 'N/A';
      let mobileNo = 'N/A';

      if (student.familyDetails?.father?.firstName) {
        recipientName = `${student.familyDetails.father.firstName} ${student.familyDetails.father.lastName || ''}`.trim();
        mobileNo = student.familyDetails.father.mobile || student.contactAddress?.contactNumber || 'N/A';
      } else if (student.familyDetails?.mother?.firstName) {
        recipientName = `${student.familyDetails.mother.firstName} ${student.familyDetails.mother.lastName || ''}`.trim();
        mobileNo = student.familyDetails.mother.mobile || student.contactAddress?.contactNumber || 'N/A';
      } else if (student.guardianDetails?.name) {
        recipientName = student.guardianDetails.name;
        mobileNo = student.guardianDetails.mobile || student.contactAddress?.contactNumber || 'N/A';
      }

      return {
        id: student._id,
        sNo: index + 1,
        class: student.academicDetails?.class || 'N/A',
        rollNo: student.academicDetails?.rollNumber || 'N/A',
        admissionNo: student.academicDetails?.admissionNumber || 'N/A',
        recipientName,
        childName: `${student.personalDetails?.firstName} ${student.personalDetails?.lastName || ''}`.trim(),
        mobileNo
      };
    });

    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Send a specified (bulk) message
// @route   POST /api/specified-messages/send
// @access  Private
const sendSpecifiedMessage = async (req, res) => {
  try {
    const { subject, body, sendToClass, recipients } = req.body;

    if (!subject || !body || !recipients) {
      return res.status(400).json({ message: 'Subject, body, and recipients are required' });
    }

    let parsedRecipients = recipients;
    if (typeof recipients === 'string') {
      try {
        parsedRecipients = JSON.parse(recipients);
      } catch (e) {
        parsedRecipients = [recipients];
      }
    }

    let attachmentUrl = null;
    let originalFileName = null;

    if (req.file) {
      attachmentUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;
      originalFileName = req.file.originalname;
    }

    const message = new SpecifiedMessage({
      subject,
      body,
      sendToClass: sendToClass || null,
      recipients: parsedRecipients,
      attachment: attachmentUrl,
      originalFileName,
      sentBy: req.user._id // From authMiddleware
    });

    const savedMessage = await message.save();

    res.status(201).json({
      message: 'Specified Message sent successfully',
      data: savedMessage
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- Template Controllers ---

// @desc    Create a new message template
// @route   POST /api/specified-messages/templates
// @access  Private
const createTemplate = async (req, res) => {
  try {
    const { subject, body } = req.body;
    if (!subject || !body) {
      return res.status(400).json({ message: 'Subject and body are required' });
    }

    const template = new MessageTemplate({ subject, body });
    const savedTemplate = await template.save();

    res.status(201).json(savedTemplate);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all message templates
// @route   GET /api/specified-messages/templates
// @access  Private
const getTemplates = async (req, res) => {
  try {
    const templates = await MessageTemplate.find().sort({ createdAt: -1 });
    res.status(200).json(templates);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a message template
// @route   DELETE /api/specified-messages/templates/:id
// @access  Private
const deleteTemplate = async (req, res) => {
  try {
    const template = await MessageTemplate.findByIdAndDelete(req.params.id);
    if (!template) {
      return res.status(404).json({ message: 'Template not found' });
    }
    res.status(200).json({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getContacts,
  sendSpecifiedMessage,
  createTemplate,
  getTemplates,
  deleteTemplate
};
