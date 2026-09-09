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

    // 1. Check Pay Scales
    const scales = JSON.parse(execSync(`curl.exe -s -H "Authorization: Bearer ${token}" http://localhost:5000/api/pay-scales`).toString());

    // 2. Check Pay Scale Amounts
    const amounts = JSON.parse(execSync(`curl.exe -s -H "Authorization: Bearer ${token}" http://localhost:5000/api/pay-scale-amounts`).toString());

    // 3. Check Grade Pays
    const gradePays = JSON.parse(execSync(`curl.exe -s -H "Authorization: Bearer ${token}" http://localhost:5000/api/grade-pays`).toString());

    // 4. Check Fixations
    const fixations = JSON.parse(execSync(`curl.exe -s -H "Authorization: Bearer ${token}" http://localhost:5000/api/fixations`).toString());

    // 5. Check Staff (Ayup Khan)
    const staffs = JSON.parse(execSync(`curl.exe -s -H "Authorization: Bearer ${token}" http://localhost:5000/api/staffs`).toString());
    const ayup = staffs.find(s => s.userName === 'SF072' || (s.firstName && s.firstName.toLowerCase().includes('ayup')));

    console.log('PAY SCALE VERIFICATION RESULTS:', {
      scalesCount: scales.length,
      amountsCount: amounts.length,
      gradePaysCount: gradePays.length,
      fixationsCount: fixations.length,
      ayupStaff: ayup ? {
        name: `${ayup.firstName} ${ayup.lastName}`,
        payScale: ayup.payScale,
        gradePay: ayup.gradePay,
        basicSalary: ayup.basicSalary,
        payScaleAmount: ayup.payScaleAmount
      } : null
    });

    process.exit(0);
  } catch (err) {
    console.error('Error during pay scale verification:', err);
    process.exit(1);
  }
})();
