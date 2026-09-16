const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI || process.env.MONGO_URI);
  console.log('Connected!');

  const db = mongoose.connection.db;

  // 1. Ensure all students have status: 'Active'
  const updateRes = await db.collection('students').updateMany(
    { $or: [{ status: { $exists: false } }, { status: null }, { status: '' }] },
    { $set: { status: 'Active' } }
  );
  console.log('Updated students to Active:', updateRes.modifiedCount);

  // 2. Insert StudentFeeLedger directly into collection without mongoose model populate issues
  const existingLedgers = await db.collection('studentfeeledgers').countDocuments();
  console.log('Existing student fee ledgers in DB:', existingLedgers);

  if (existingLedgers === 0) {
    const students = await db.collection('students').find({}, { projection: { _id: 1, academicDetails: 1 } }).toArray();
    console.log(`Found ${students.length} students to generate fee ledgers for.`);

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

    const ledgers = students.map(st => {
      const cls = (st.academicDetails?.class || '').toUpperCase();
      const fee = defaultClassFees[cls] || 28000;
      return {
        student: st._id,
        academicYear: '2026-2027',
        totalPayable: fee,
        totalPaid: 0,
        totalConcession: 0,
        totalDues: fee,
        status: 'Unpaid',
        createdAt: new Date(),
        updatedAt: new Date()
      };
    });

    await db.collection('studentfeeledgers').insertMany(ledgers);
    console.log(`Successfully created ${ledgers.length} StudentFeeLedger records!`);
  }

  // 3. Test the dashboard endpoints directly to be 100% sure
  const totalStudents = await db.collection('students').countDocuments({ status: 'Active' });
  const totalBoys = await db.collection('students').countDocuments({ status: 'Active', 'personalDetails.gender': { $in: ['Male', 'male', 'Boy', 'BOY'] } });
  const totalGirls = await db.collection('students').countDocuments({ status: 'Active', 'personalDetails.gender': { $in: ['Female', 'female', 'Girl', 'GIRL'] } });

  const totalLedger = await db.collection('studentfeeledgers').aggregate([
    {
      $group: {
        _id: null,
        totalPayable: { $sum: "$totalPayable" },
        totalDues: { $sum: "$totalDues" }
      }
    }
  ]).toArray();

  console.log('--- DASHBOARD TEST RESULT ---');
  console.log('Headcount Total:', totalStudents, 'Boys:', totalBoys, 'Girls:', totalGirls);
  console.log('Revenue Stats:', totalLedger[0]);

  await mongoose.disconnect();
  console.log('Done!');
  process.exit(0);
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
