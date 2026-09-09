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
    
    // 1. Check Income Tax Slabs
    const slabs = JSON.parse(execSync(`curl.exe -s -H "Authorization: Bearer ${token}" http://localhost:5000/api/income-tax-slabs`).toString());
    
    // 2. Check IT Head Groups
    const groups = JSON.parse(execSync(`curl.exe -s -H "Authorization: Bearer ${token}" http://localhost:5000/api/it-head-groups`).toString());
    
    // 3. Check IT Heads
    const heads = JSON.parse(execSync(`curl.exe -s -H "Authorization: Bearer ${token}" http://localhost:5000/api/it-heads`).toString());
    
    // 4. Check TDS Deductees
    const deductees = JSON.parse(execSync(`curl.exe -s -H "Authorization: Bearer ${token}" http://localhost:5000/api/tds-deductee`).toString());
    const primaryDeductee = JSON.parse(execSync(`curl.exe -s -H "Authorization: Bearer ${token}" http://localhost:5000/api/tds-deductee/primary`).toString());
    
    // 5. Check Staff with Ayup Khan
    const staffs = JSON.parse(execSync(`curl.exe -s -H "Authorization: Bearer ${token}" http://localhost:5000/api/staffs`).toString());
    const ayup = staffs.find(s => s.userName === 'SF072' || (s.firstName && s.firstName.toLowerCase().includes('ayup')));

    console.log('TDS VERIFICATION RESULTS:', {
      slabsCount: slabs.length,
      groupsCount: groups.length,
      headsCount: heads.length,
      deducteesCount: deductees.length,
      primaryDeducteeName: primaryDeductee.name,
      ayupStaff: ayup ? {
        name: `${ayup.firstName} ${ayup.lastName}`,
        taxRegime: ayup.taxRegime,
        itSlabGroup: ayup.itSlabGroup
      } : null
    });

    process.exit(0);
  } catch (err) {
    console.error('Error during verification:', err);
    process.exit(1);
  }
})();
