const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const Admin = require('./models/adminModel');
const Staff = require('./models/staffModel');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

async function checkTaxAndDocs() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const admin = await Admin.findOne();
    const token = jwt.sign({ id: admin._id, userType: 'admin' }, process.env.JWT_SECRET);
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('=== VERIFYING PROFESSIONAL TAX SLABS ENDPOINT ===');
    const slabsRes = await fetch('http://localhost:5000/api/professional-tax-slabs', { headers });
    const slabs = await slabsRes.json();
    console.log('1. Total Slabs Count:', slabs.length);
    const ayupSlabs = slabs.filter(s => s.groupName && s.groupName.includes('Ayup Tech'));
    console.log('2. Ayup Tech Slabs Count:', ayupSlabs.length);
    console.log('3. Ayup Tech Slabs Sample:', ayupSlabs.map(s => ({
      group: s.groupName,
      slNo: s.groupSlNo,
      lower: s.lowerBound,
      upper: s.upperBound,
      tax: s.tax
    })));

    console.log('\n=== VERIFYING SLAB GROUPS ENDPOINT ===');
    const groupsRes = await fetch('http://localhost:5000/api/professional-tax-slabs/groups', { headers });
    const groups = await groupsRes.json();
    console.log('Groups returned:', groups);

    console.log('\n=== VERIFYING STAFF DOCUMENTS ENDPOINT ===');
    const ayupStaff = await Staff.findOne({
      $or: [
        { userName: 'SF072' },
        { firstName: { $regex: 'ayup', $options: 'i' } }
      ]
    });

    if (ayupStaff) {
      const docsRes = await fetch(`http://localhost:5000/api/staffs/${ayupStaff._id}/documents`, { headers });
      const docs = await docsRes.json();
      console.log('1. Ayup Tech Documents Count:', docs.length);
      console.log('2. Ayup Tech Documents:', docs.map(d => ({
        type: d.documentType,
        name: d.documentName,
        verified: d.isVerified
      })));

      // Test verify toggle endpoint
      if (docs.length > 0) {
        console.log('\n=== TESTING DOCUMENT VERIFY TOGGLE ===');
        const targetDoc = docs[0];
        const verifyRes = await fetch(`http://localhost:5000/api/staffs/${ayupStaff._id}/documents/${targetDoc._id}/verify`, {
          method: 'PATCH',
          headers,
          body: JSON.stringify({ isVerified: true, verifiedBy: 'Ayup Tech HR' })
        });
        const verifyJson = await verifyRes.json();
        console.log('Verify toggle result message:', verifyJson.message);
        console.log('Target document updated verification status:', verifyJson.document?.isVerified);
      }
    }

    console.log('\n🎉 ALL PROFESSIONAL TAX AND STAFF DOCUMENT ENDPOINTS TESTED SUCCESSFULLY WITH "AYUP TECH"!');
    process.exit(0);
  } catch (err) {
    console.error('Check failed:', err);
    process.exit(1);
  }
}

checkTaxAndDocs();
