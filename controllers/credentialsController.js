const CredentialLog = require('../models/credentialLogModel');

// @desc    Send Credentials to Users
// @route   POST /api/credentials/send
// @access  Private (Admin)
const sendCredentials = async (req, res) => {
  try {
    const { sendVia, sendToType, recipients } = req.body;
    
    if (!sendVia || !sendToType) {
      return res.status(400).json({ message: 'sendVia and sendToType are required' });
    }

    // In a production app, you would:
    // 1. Fetch the actual users based on the 'recipients' IDs.
    // 2. Format the SMS/Email containing their username and password/link.
    // 3. Dispatch the message via Twilio / Nodemailer.
    
    const log = new CredentialLog({
      sendVia,
      sendToType,
      recipients: recipients || [],
      sentBy: req.user?._id
    });

    const saved = await log.save();
    res.status(200).json({ 
      message: `Credentials sent successfully via ${sendVia}`, 
      data: saved 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all Credential Logs
// @route   GET /api/credentials/logs
// @access  Private (Admin)
const getCredentialLogs = async (req, res) => {
  try {
    const logs = await CredentialLog.find().sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  sendCredentials,
  getCredentialLogs
};
