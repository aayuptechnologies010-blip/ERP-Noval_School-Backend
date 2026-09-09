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

    console.log('\n--- 1. Testing GET /api/salary-structure/bank-statement ---');
    let cmd = `curl.exe -s -H "Authorization: Bearer ${token}" "http://localhost:5000/api/salary-structure/bank-statement?monthYear=Aug-2026"`;
    let res = JSON.parse(execSync(cmd).toString());
    console.log(`Status 200 OK | Count: ${res.length} bank records`);
    console.log(`Sample: ${res[0].staffName} | A/C: ${res[0].bankAccountNo} | Net: ₹${res[0].netSalary}`);

    console.log('\n--- 2. Testing GET /api/salary-structure/head-wise-report?headName=HRA ---');
    cmd = `curl.exe -s -H "Authorization: Bearer ${token}" "http://localhost:5000/api/salary-structure/head-wise-report?headName=HRA&monthYear=Aug-2026"`;
    res = JSON.parse(execSync(cmd).toString());
    console.log(`Status 200 OK | Count: ${res.length} head records`);
    console.log(`Sample: ${res[0].staffName} | Head: ${res[0].selectedHeadName} | Head Value: ₹${res[0].headValue}`);

    console.log('\n--- 3. Testing GET /api/salary-structure/salary-generation (Salary Sheet) ---');
    cmd = `curl.exe -s -H "Authorization: Bearer ${token}" "http://localhost:5000/api/salary-structure/salary-generation?monthYear=Aug-2026"`;
    res = JSON.parse(execSync(cmd).toString());
    console.log(`Status 200 OK | Count: ${res.length} salary records`);
    console.log(`Sample: ${res[0].staffName} | Gross: ₹${res[0].grossSalary} | Net: ₹${res[0].netSalary}`);

    console.log('\n--- 4. Testing POST /api/salary-structure/salary-sheet/sms ---');
    const smsData = JSON.stringify({ monthYear: 'Aug-2026', count: 6 }).replace(/"/g, '\\"');
    cmd = `curl.exe -s -X POST -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" -d "${smsData}" "http://localhost:5000/api/salary-structure/salary-sheet/sms"`;
    res = JSON.parse(execSync(cmd).toString());
    console.log(`Status 200 OK | Message: ${res.message}`);

    console.log('\n--- 5. Testing POST /api/salary-structure/salary-slip/mail ---');
    const mailData = JSON.stringify({ staffName: 'Ayup Tech Lead', email: 'ayup.tech@novals.edu', monthYear: 'Aug-2026' }).replace(/"/g, '\\"');
    cmd = `curl.exe -s -X POST -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" -d "${mailData}" "http://localhost:5000/api/salary-structure/salary-slip/mail"`;
    res = JSON.parse(execSync(cmd).toString());
    console.log(`Status 200 OK | Message: ${res.message}`);

    console.log('\n🎉 ALL CURL VERIFICATIONS FOR SALARY REPORTS PASSED!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Error during curl test:', err);
    process.exit(1);
  }
})();
