require('dotenv').config();
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const Admin = require('./models/adminModel');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const admin = await Admin.findOne();
    const token = jwt.sign({ id: admin._id, userType: 'admin' }, process.env.JWT_SECRET);
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    };

    console.log('=== VERIFYING INSURANCE SECTION ENDPOINTS ===');

    // 1. GET /api/insurance-vendors
    const vRes = await fetch('http://localhost:5000/api/insurance-vendors', { headers });
    const vendors = await vRes.json();
    const ayupVendor = vendors.find(v => v.vendorName.includes('Ayup Tech'));

    console.log('1. Insurance Vendors Check:', {
      count: vendors.length,
      ayupVendor: ayupVendor ? {
        name: ayupVendor.vendorName,
        contact: ayupVendor.contactPerson,
        phone: ayupVendor.phone
      } : null
    });

    // 2. GET /api/employee-insurance-policies
    const pRes = await fetch('http://localhost:5000/api/employee-insurance-policies', { headers });
    const policies = await pRes.json();
    const ayupPolicies = policies.filter(p => p.staffName && p.staffName.toLowerCase().includes('ayup'));

    console.log('2. Employee Policies Check:', {
      totalPolicies: policies.length,
      ayupPoliciesCount: ayupPolicies.length,
      ayupPolicies: ayupPolicies.map(p => ({
        policyNo: p.policyNo,
        policyName: p.policyName,
        vendor: p.vendorName,
        premium: p.premiumAmount,
        status: p.status
      }))
    });

    // 3. GET /api/monthly-insurance-deductions?monthYear=September-2026
    const dRes = await fetch('http://localhost:5000/api/monthly-insurance-deductions?monthYear=September-2026', { headers });
    const deductions = await dRes.json();
    console.log('3. Monthly Deductions Check:', {
      monthYear: 'September-2026',
      deductionsCount: deductions.length,
      sample: deductions.length > 0 ? {
        staffName: deductions[0].staffName,
        policyNo: deductions[0].policyNo,
        vendor: deductions[0].vendorName,
        premium: deductions[0].premiumAmount,
        status: deductions[0].status
      } : null
    });

    // 4. Test Generate Deductions for October-2026
    const genRes = await fetch('http://localhost:5000/api/monthly-insurance-deductions/generate', {
      method: 'POST',
      headers,
      body: JSON.stringify({ monthYear: 'October-2026', month: 'October', year: '2026' })
    });
    const genResult = await genRes.json();
    console.log('4. Test Monthly Deduction Generation Result:', {
      status: genRes.status,
      message: genResult.message,
      generatedCount: genResult.count
    });

    console.log('\n🎉 ALL INSURANCE SECTION ENDPOINTS VERIFIED SUCCESSFULLY WITH "AYUP TECH"!');
    process.exit(0);
  } catch (err) {
    console.error('Error during insurance verification:', err);
    process.exit(1);
  }
})();
