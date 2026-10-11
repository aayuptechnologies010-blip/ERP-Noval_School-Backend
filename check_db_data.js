const mongoose = require('mongoose');
require('dotenv').config();
const FeeReceipt = require('./models/feeReceiptModel');
const Student = require('./models/studentModel');
const StudentFeeLedger = require('./models/studentFeeLedgerModel');

async function check() {
  await mongoose.connect(process.env.MONGO_URI);
  const modes = await FeeReceipt.distinct('paymentMode');
  const statuses = await FeeReceipt.distinct('status');
  const dates = await FeeReceipt.aggregate([
    { $group: { _id: null, minDate: { $min: '$receiptDate' }, maxDate: { $max: '$receiptDate' }, count: { $sum: 1 } } }
  ]);
  const sampleStudent = await Student.findOne({}, 'academicDetails personalDetails contactDetails parentsDetails').lean();
  console.log(JSON.stringify({ modes, statuses, dates, sampleStudent }, null, 2));
  process.exit(0);
}

check().catch(e => { console.error(e); process.exit(1); });
