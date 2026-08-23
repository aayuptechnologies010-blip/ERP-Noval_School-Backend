const mongoose = require('mongoose');

const feeSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  feeType: {
    type: String,
    required: true,
    enum: ['Admission Fee', 'Tuition Fee', 'Transport Fee', 'Library Fee', 'Hostel Fee', 'Exam Fee', 'Other']
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  dueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Partially Paid', 'Paid', 'Overdue'],
    default: 'Pending'
  },
  amountPaid: {
    type: Number,
    default: 0,
    min: 0
  },
  paymentMethod: {
    type: String,
    enum: ['Cash', 'Card', 'UPI', 'Bank Transfer', 'Cheque', 'None'],
    default: 'None'
  },
  paymentDate: {
    type: Date
  },
  remarks: {
    type: String
  }
}, {
  timestamps: true
});

const Fee = mongoose.model('Fee', feeSchema);

module.exports = Fee;
