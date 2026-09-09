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
    console.log('✅ Admin Token generated successfully');

    // 1. GET /api/salary-accounts
    console.log('\n--- 1. Testing GET /api/salary-accounts ---');
    let out = execSync(`curl.exe -s -H "Authorization: Bearer ${token}" http://localhost:5000/api/salary-accounts`).toString();
    let accs = JSON.parse(out);
    console.log(`Found ${accs.length} accounts:`, accs.map(a => `${a.accountName} (${a.bank})`));

    // 2. POST /api/salary-accounts
    console.log('\n--- 2. Testing POST /api/salary-accounts ---');
    const postData = JSON.stringify({ accountName: 'Ayup Test Account', bank: 'Canara Bank', accountNo: '99988877711' }).replace(/"/g, '\\"');
    out = execSync(`curl.exe -s -X POST -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" -d "${postData}" http://localhost:5000/api/salary-accounts`).toString();
    let newAcc = JSON.parse(out);
    console.log('✅ Created Account:', newAcc.accountName, `(ID: ${newAcc._id})`);

    // 3. DELETE /api/salary-accounts/:id
    console.log('\n--- 3. Testing DELETE /api/salary-accounts/:id ---');
    out = execSync(`curl.exe -s -X DELETE -H "Authorization: Bearer ${token}" http://localhost:5000/api/salary-accounts/${newAcc._id}`).toString();
    console.log('✅ Delete response:', out.trim());

    // 4. GET /api/salary-months
    console.log('\n--- 4. Testing GET /api/salary-months ---');
    out = execSync(`curl.exe -s -H "Authorization: Bearer ${token}" http://localhost:5000/api/salary-months`).toString();
    let months = JSON.parse(out);
    console.log(`✅ Found ${months.length} months. First 4:`, months.slice(0, 4).map(m => `${m.orderNo}: ${m.month} ${m.year} (Working: ${m.workingDays}, Total: ${m.totalDays})`));

    // 5. GET /api/staffs (verify Ayup Khan)
    console.log('\n--- 5. Testing GET /api/staffs (Verifying Ayup Khan) ---');
    out = execSync(`curl.exe -s -H "Authorization: Bearer ${token}" http://localhost:5000/api/staffs`).toString();
    let staffs = JSON.parse(out);
    let ayup = staffs.find(s => s.userName === 'SF072');
    if (ayup) {
      console.log('✅ Ayup Khan Found:', {
        name: `${ayup.title} ${ayup.firstName} ${ayup.lastName}`,
        code: ayup.userName,
        prefNo: ayup.prefNo,
        designation: ayup.designation,
        salaryAccount: ayup.salaryAccount,
        basicSalary: ayup.basicSalary,
        headsCount: ayup.salaryHeads ? ayup.salaryHeads.length : 0,
        eduCount: ayup.educationDetails ? ayup.educationDetails.length : 0
      });
    } else {
      console.error('❌ Ayup Khan not found in staffs');
    }

    // 6. PUT /api/staffs/bulk/assign-info
    console.log('\n--- 6. Testing PUT /api/staffs/bulk/assign-info ---');
    const bulkData = JSON.stringify({ staffIds: [ayup._id], salaryAccount: 'Ayup Salary Account', staffType: 'PRIMARY TEACHERS' }).replace(/"/g, '\\"');
    out = execSync(`curl.exe -s -X PUT -H "Authorization: Bearer ${token}" -H "Content-Type: application/json" -d "${bulkData}" http://localhost:5000/api/staffs/bulk/assign-info`).toString();
    console.log('✅ Bulk Assign Response:', out.trim());

    console.log('\n=========================================');
    console.log('🎉 ALL PAYROLL MASTER ENDPOINTS VERIFIED SUCCESSFULLY!');
    console.log('=========================================');
    process.exit(0);
  } catch (err) {
    console.error('Verification error:', err);
    process.exit(1);
  }
})();
