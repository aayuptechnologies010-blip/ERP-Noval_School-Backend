const mongoose = require('mongoose');

const smsRechargeSchema = new mongoose.Schema(
  {
    credits: {
      type: Number,
      required: [true, 'Credits are required']
    },
    amount: {
      type: Number,
      required: [true, 'Amount is required']
    },
    validity: {
      type: Date
    },
    status: {
      type: String,
      enum: ['Completed', 'Pending', 'Failed'],
      default: 'Completed'
    },
    transactionId: {
      type: String,
      trim: true
    },
    rechargedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin'
    }
  },
  { timestamps: true }
);

const SmsRecharge = mongoose.model('SmsRecharge', smsRechargeSchema);
module.exports = SmsRecharge;
