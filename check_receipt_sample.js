const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const FeeReceipt = mongoose.model('FeeReceipt', new mongoose.Schema({}, { strict: false }));
  const Student = mongoose.model('Student', new mongoose.Schema({}, { strict: false }));

  const sampleReceipt = await FeeReceipt.findOne().lean();
  console.log('Sample Receipt:', JSON.stringify(sampleReceipt, null, 2));

  const nonTransportStudents = await Student.countDocuments({
    $and: [
      { transportAssigned: { $ne: true } },
      { 'transportDetails.isTransportStudent': { $ne: true } },
      { transportRoute: { $in: [null, ''] } }
    ]
  });
  console.log('Non-transport students count:', nonTransportStudents);

  const sampleNonTransport = await Student.findOne({
    $and: [
      { transportAssigned: { $ne: true } },
      { 'transportDetails.isTransportStudent': { $ne: true } },
      { transportRoute: { $in: [null, ''] } }
    ]
  }).lean();
  console.log('Sample Non Transport Student:', sampleNonTransport ? {
    admissionNumber: sampleNonTransport.academicDetails?.admissionNumber || sampleNonTransport.admissionNumber,
    name: sampleNonTransport.personalDetails?.firstName,
    transportDetails: sampleNonTransport.transportDetails,
    selfTransport: sampleNonTransport.selfTransport
  } : null);

  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });
