const mongoose = require('mongoose');

const credentialLogSchema = new mongoose.Schema(
  {
    sendVia: {
      type: String,
      enum: ['SMS', 'Email'],
      required: [true, 'sendVia (SMS or Email) is required']
    },
    sendToType: {
      type: String,
      required: [true, 'sendToType is required']
    },
    recipients: [
      {
        type: mongoose.Schema.Types.ObjectId,
        // References can be polymorphic (Student, Staff, etc.) based on sendToType
      }
    ],
    sentBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true
    }
  },
  {
    timestamps: true
  }
);

const CredentialLog = mongoose.model('CredentialLog', credentialLogSchema);
module.exports = CredentialLog;
