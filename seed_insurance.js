require('dotenv').config();
const mongoose = require('mongoose');
const InsuranceVendor = require('./models/insuranceVendorModel');
const EmployeeInsurancePolicy = require('./models/employeeInsurancePolicyModel');
const MonthlyInsuranceDeduction = require('./models/monthlyInsuranceDeductionModel');
const Staff = require('./models/staffModel');

(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully.');

    // 1. Seed Insurance Vendors
    await InsuranceVendor.deleteMany({});
    const vendors = [
      {
        vendorName: 'Ayup Tech Insurance Care',
        contactPerson: 'Ayup Tech',
        phone: '9876543210',
        email: 'ayup.tech@insurance.com',
        address: 'Civil Lines, Gorakhpur',
        isActive: true
      },
      {
        vendorName: 'LIC of India',
        contactPerson: 'R.K. Verma',
        phone: '0551-220011',
        email: 'gorakhpur.branch@licindia.com',
        address: 'Golghar Main Road, Gorakhpur',
        isActive: true
      },
      {
        vendorName: 'HDFC Life Insurance',
        contactPerson: 'Priya Singh',
        phone: '0551-233445',
        email: 'priya.singh@hdfclife.com',
        address: 'Park Road, Civil Lines, Gorakhpur',
        isActive: true
      },
      {
        vendorName: 'SBI Life Insurance',
        contactPerson: 'Amit Kumar',
        phone: '0551-244556',
        email: 'amit.kumar@sbilife.co.in',
        address: 'Station Road, Gorakhpur',
        isActive: true
      },
      {
        vendorName: 'Max Life Insurance',
        contactPerson: 'Neha Gupta',
        phone: '0551-255667',
        email: 'neha.gupta@maxlife.com',
        address: 'Medical College Road, Gorakhpur',
        isActive: true
      }
    ];
    const createdVendors = await InsuranceVendor.insertMany(vendors);
    console.log(`✅ Seeded ${createdVendors.length} Insurance Vendors`);

    const ayupVendor = createdVendors.find(v => v.vendorName.includes('Ayup Tech'));
    const licVendor = createdVendors.find(v => v.vendorName === 'LIC of India');
    const hdfcVendor = createdVendors.find(v => v.vendorName === 'HDFC Life Insurance');

    // 2. Find Ayup Tech and Other Staff
    let ayup = await Staff.findOne({
      $or: [{ userName: 'SF072' }, { firstName: /ayup/i }]
    });

    const otherStaff = await Staff.find({ _id: { $ne: ayup ? ayup._id : null } }).limit(4);

    // 3. Seed Employee Insurance Policies
    await EmployeeInsurancePolicy.deleteMany({});
    const policies = [];

    if (ayup) {
      policies.push({
        staffId: ayup._id,
        staffName: `${ayup.firstName} ${ayup.lastName}`.trim(),
        empNo: ayup.empNo || ayup.userName || 'SF072',
        vendorId: ayupVendor ? ayupVendor._id : null,
        vendorName: 'Ayup Tech Insurance Care',
        policyNo: 'POL-AYUP-7722',
        policyName: 'Ayup Tech Jeevan Labh Endowment',
        premiumAmount: 2500,
        startDate: new Date('2024-04-01'),
        maturityDate: new Date('2039-04-01'),
        frequency: 'Monthly',
        status: 'Active',
        remarks: 'Primary life savings policy for Ayup Tech'
      });

      policies.push({
        staffId: ayup._id,
        staffName: `${ayup.firstName} ${ayup.lastName}`.trim(),
        empNo: ayup.empNo || ayup.userName || 'SF072',
        vendorId: licVendor ? licVendor._id : null,
        vendorName: 'LIC of India',
        policyNo: 'POL-LIC-10928',
        policyName: 'LIC Arogya Sanjeevani Health Plan',
        premiumAmount: 1800,
        startDate: new Date('2025-01-01'),
        maturityDate: new Date('2035-01-01'),
        frequency: 'Monthly',
        status: 'Active',
        remarks: 'Family health insurance coverage'
      });
    }

    if (otherStaff.length > 0) {
      const s1 = otherStaff[0];
      policies.push({
        staffId: s1._id,
        staffName: `${s1.firstName || ''} ${s1.lastName || ''}`.trim(),
        empNo: s1.empNo || s1.userName || 'SF001',
        vendorId: hdfcVendor ? hdfcVendor._id : null,
        vendorName: 'HDFC Life Insurance',
        policyNo: 'POL-HDFC-5544',
        policyName: 'HDFC Click 2 Protect Life',
        premiumAmount: 1600,
        startDate: new Date('2024-06-01'),
        maturityDate: new Date('2034-06-01'),
        frequency: 'Monthly',
        status: 'Active',
        remarks: 'Term life cover'
      });
    }

    const createdPolicies = await EmployeeInsurancePolicy.insertMany(policies);
    console.log(`✅ Seeded ${createdPolicies.length} Employee Insurance Policies (including Ayup Tech's 2 policies)`);

    // 4. Seed Monthly Deductions for "September-2026"
    await MonthlyInsuranceDeduction.deleteMany({});
    const monthYear = 'September-2026';
    const monthlyDeductions = createdPolicies.map(p => ({
      monthYear,
      month: 'September',
      year: '2026',
      staffId: p.staffId,
      staffName: p.staffName,
      empNo: p.empNo,
      policyId: p._id,
      policyNo: p.policyNo,
      policyName: p.policyName,
      vendorName: p.vendorName,
      premiumAmount: p.premiumAmount,
      status: 'Scheduled',
      remarks: `Automated deduction for ${monthYear}`
    }));

    const createdDeductions = await MonthlyInsuranceDeduction.insertMany(monthlyDeductions);
    console.log(`✅ Seeded ${createdDeductions.length} Monthly Deductions for "${monthYear}"`);

    console.log('\n🎉 ALL INSURANCE SECTION DATA SEEDED SUCCESSFULLY WITH "AYUP TECH"!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding insurance data:', err);
    process.exit(1);
  }
})();
