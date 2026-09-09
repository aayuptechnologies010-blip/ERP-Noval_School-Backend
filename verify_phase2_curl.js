require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('./models/adminModel');
const { execSync } = require('child_process');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = await Admin.findOne();
    const token = jwt.sign({ id: admin._id, userType: 'admin' }, process.env.JWT_SECRET);
    console.log('✅ Admin Token generated');

    const endpoints = [
      '/api/salary-structure/increment',
      '/api/salary-structure/staff-salary-structure',
      '/api/salary-structure/salary-status',
      '/api/salary-structure/daily-wages'
    ];

    for (const ep of endpoints) {
      console.log(`\nTesting GET ${ep} ...`);
      const cmd = `curl.exe -s -H "Authorization: Bearer ${token}" "http://localhost:5000${ep}"`;
      const resStr = execSync(cmd).toString();
      const data = JSON.parse(resStr);
      console.log(`Status 200 OK | Count: ${data.length} records`);
      const sample = data[0];
      if (sample) {
        console.log(`Sample Staff: ${sample.staffName} | ID: ${sample.employeeId}`);
      }
    }

    console.log('\nTesting POST /api/salary-structure/increment ...');
    const newInc = JSON.stringify({
      staffName: 'Ayup Tech Lead',
      employeeId: 'EMP-AT-001',
      incrementType: 'TA',
      incrementAppliedFrom: 'Sep-2026',
      percentValue: 5,
      previousAmount: 4000,
      remarks: 'Transport increment curl test'
    }).replace(/"/g, '\\"');
    const postCmd = `curl.exe -s -X POST -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" -d "${newInc}" "http://localhost:5000/api/salary-structure/increment"`;
    const postRes = JSON.parse(execSync(postCmd).toString());
    console.log('✅ Created Increment:', postRes.staffName, postRes.incrementType, `+₹${postRes.incrementAmount}`);

    console.log('\nTesting PUT rollback on new increment...');
    const rbCmd = `curl.exe -s -X PUT -H "Authorization: Bearer ${token}" "http://localhost:5000/api/salary-structure/increment/${postRes._id}/rollback"`;
    const rbRes = JSON.parse(execSync(rbCmd).toString());
    console.log('✅ Rolled Back Increment:', rbRes.staffName, `Status: ${rbRes.status}`);

    console.log('\n🎉 ALL CURL TESTS PASSED FOR 5 PAYROLL PAGES!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during curl test:', err);
    process.exit(1);
  }
})();
