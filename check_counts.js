const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const Student = mongoose.model('Student', new mongoose.Schema({}, { strict: false }));
  const FeeReceipt = mongoose.model('FeeReceipt', new mongoose.Schema({}, { strict: false }));

  const total = await Student.countDocuments();
  const transport = await Student.countDocuments({
    $or: [
      { transportAssigned: true },
      { 'transportDetails.isTransportStudent': true },
      { transportRoute: { $exists: true, $ne: '' } }
    ]
  });
  const self = await Student.countDocuments({
    $or: [
      { selfTransport: true },
      { 'transportDetails.isSelfTransport': true }
    ]
  });
  const receipts = await FeeReceipt.countDocuments();
  console.log(JSON.stringify({ total, transport, self, receipts }, null, 2));
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
