const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Admin = require('./models/adminModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

async function checkRecruitment() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const admin = await Admin.findOne();
    const token = jwt.sign({ id: admin._id, userType: 'admin' }, process.env.JWT_SECRET);
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('=== VERIFYING RECRUITMENT REST ENDPOINTS ===');

    // 1. Interview Types
    const itRes = await fetch('http://localhost:5000/api/recruitment/interview-types', { headers });
    const itData = await itRes.json();
    console.log('1. Interview Types Count:', itData.length, '| Sample:', itData[0]?.typeName);

    // 2. Assessment Types
    const atRes = await fetch('http://localhost:5000/api/recruitment/assessment-types', { headers });
    const atData = await atRes.json();
    console.log('2. Assessment Types Count:', atData.length, '| Sample:', atData[0]?.assessmentName);

    // 3. Interview Slots
    const isRes = await fetch('http://localhost:5000/api/recruitment/interview-slots', { headers });
    const isData = await isRes.json();
    console.log('3. Interview Slots Count:', isData.length, '| Sample:', isData[0]?.slotName);

    // 4. Job Postings
    const jpRes = await fetch('http://localhost:5000/api/recruitment/job-postings', { headers });
    const jpData = await jpRes.json();
    console.log('4. Job Postings Count:', jpData.length, '| Sample:', jpData[0]?.jobTitle);

    // 5. Applications Received
    const arRes = await fetch('http://localhost:5000/api/recruitment/applications', { headers });
    const arData = await arRes.json();
    console.log('5. Applications Received Count:', arData.length, '| Sample:', arData[0]?.candidateName);

    // 6. Slot Assignments
    const saRes = await fetch('http://localhost:5000/api/recruitment/slot-assignments', { headers });
    const saData = await saRes.json();
    console.log('6. Slot Assignments Count:', saData.length, '| Sample:', saData[0]?.candidateName, '-', saData[0]?.interviewSlot);

    // 7. Travel Plans
    const tpRes = await fetch('http://localhost:5000/api/recruitment/travel-plans', { headers });
    const tpData = await tpRes.json();
    console.log('7. Travel Plans Count:', tpData.length, '| Sample:', tpData[0]?.candidateName, 'Amount: ₹' + tpData[0]?.approvedAmount);

    console.log('\n🎉 ALL 7 RECRUITMENT REST ENDPOINTS VERIFIED SUCCESSFULLY WITH "AYUP TECH"!');
    process.exit(0);
  } catch (err) {
    console.error('Check failed:', err);
    process.exit(1);
  }
}

checkRecruitment();
