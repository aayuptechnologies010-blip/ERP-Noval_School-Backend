const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  console.log('Connected to DB');

  // 1. Update students to ensure status: 'Active' exists
  const res = await mongoose.connection.db.collection('students').updateMany(
    { $or: [{ status: { $exists: false } }, { status: null }, { status: '' }] },
    { $set: { status: 'Active' } }
  );
  console.log('Updated students with status Active:', res.modifiedCount);

  // 2. Count existing ledgers
  const Student = require('./models/studentModel');
  const StudentFeeLedger = require('./models/studentFeeLedgerModel');
  const FeeAmountGroup = require('./models/feeAmountGroupModel');

  const existingLedgerCount = await StudentFeeLedger.countDocuments();
  console.log('Existing student fee ledgers:', existingLedgerCount);

  if (existingLedgerCount === 0) {
    console.log('Creating initial StudentFeeLedger entries for 771 students...');
    const allStudents = await Student.find().lean();
    
    // Calculate fee per class from FeeAmountGroup or defaults
    const feeGroups = await FeeAmountGroup.find().populate('feeGroup').lean();
    const classFeeMap = {};
    for (const fg of feeGroups) {
      if (fg.feeGroup && fg.feeGroup.feeGroupName) {
        const clsName = fg.feeGroup.feeGroupName.toUpperCase();
        const total = (fg.amounts || []).reduce((sum, a) => sum + (a.amount || 0), 0);
        classFeeMap[clsName] = (classFeeMap[clsName] || 0) + total;
      }
    }

    const defaultClassFees = {
      'PLAY GROUP': 23500,
      'NURSERY': 24000,
      'LKG': 25000,
      'UKG': 26000,
      'CLASS - I': 27500,
      'CLASS - II': 28500,
      'CLASS - III': 29500,
      'CLASS - IV': 30500,
      'CLASS - V': 31500,
      'CLASS - VI': 33000,
      'CLASS - VII': 34500,
      'CLASS - VIII': 36000,
      'CLASS - IX': 38000,
      'CLASS - X': 40000,
      'CLASS - XI': 44300,
      'CLASS - XII': 44900
    };

    const ledgersToInsert = [];
    for (const st of allStudents) {
      const cls = (st.academicDetails?.class || '').toUpperCase();
      const totalPayable = classFeeMap[cls] || defaultClassFees[cls] || 28000;
      
      ledgersToInsert.push({
        student: st._id,
        academicYear: '2026-2027',
        totalPayable: totalPayable,
        totalPaid: 0,
        totalConcession: 0,
        totalDues: totalPayable,
        status: 'Unpaid'
      });
    }

    if (ledgersToInsert.length > 0) {
      await StudentFeeLedger.insertMany(ledgersToInsert);
      console.log(`Inserted ${ledgersToInsert.length} StudentFeeLedger records!`);
    }
  }

  await mongoose.disconnect();
  console.log('✅ ALL DONE SUCCESSFULLY!');
}

run().catch(console.error);
