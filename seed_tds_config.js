require('dotenv').config();
const mongoose = require('mongoose');
const IncomeTaxSlab = require('./models/incomeTaxSlabModel');
const ITHeadGroup = require('./models/itHeadGroupModel');
const ITHead = require('./models/itHeadModel');
const TDSDeductee = require('./models/tdsDeducteeModel');
const Staff = require('./models/staffModel');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for TDS Configuration seeding...');

    // 1. Seed Income Tax Slabs
    await IncomeTaxSlab.deleteMany({});
    const slabs = [
      // Existing Regime - Female
      { slabType: 'Tax payable in Existing Regime', groupName: 'For Female', groupSlNo: 1, lowerBound: 0, upperBound: 250000, taxRate: 0 },
      { slabType: 'Tax payable in Existing Regime', groupName: 'For Female', groupSlNo: 2, lowerBound: 250001, upperBound: 500000, taxRate: 5 },
      { slabType: 'Tax payable in Existing Regime', groupName: 'For Female', groupSlNo: 3, lowerBound: 500001, upperBound: 1000000, taxRate: 20 },
      { slabType: 'Tax payable in Existing Regime', groupName: 'For Female', groupSlNo: 4, lowerBound: 1000001, upperBound: 10000000, taxRate: 30 },
      
      // Existing Regime - Male
      { slabType: 'Tax payable in Existing Regime', groupName: 'For Male', groupSlNo: 1, lowerBound: 0, upperBound: 250000, taxRate: 0 },
      { slabType: 'Tax payable in Existing Regime', groupName: 'For Male', groupSlNo: 2, lowerBound: 250001, upperBound: 500000, taxRate: 5 },
      { slabType: 'Tax payable in Existing Regime', groupName: 'For Male', groupSlNo: 3, lowerBound: 500001, upperBound: 1000000, taxRate: 20 },
      { slabType: 'Tax payable in Existing Regime', groupName: 'For Male', groupSlNo: 4, lowerBound: 1000001, upperBound: 10000000, taxRate: 30 },

      // New Regime - Standard
      { slabType: 'Tax payable in New Regime', groupName: 'For Male', groupSlNo: 1, lowerBound: 0, upperBound: 300000, taxRate: 0 },
      { slabType: 'Tax payable in New Regime', groupName: 'For Male', groupSlNo: 2, lowerBound: 300001, upperBound: 600000, taxRate: 5 },
      { slabType: 'Tax payable in New Regime', groupName: 'For Male', groupSlNo: 3, lowerBound: 600001, upperBound: 900000, taxRate: 10 },
      { slabType: 'Tax payable in New Regime', groupName: 'For Male', groupSlNo: 4, lowerBound: 900001, upperBound: 1200000, taxRate: 15 },
      { slabType: 'Tax payable in New Regime', groupName: 'For Male', groupSlNo: 5, lowerBound: 1200001, upperBound: 1500000, taxRate: 20 },
      { slabType: 'Tax payable in New Regime', groupName: 'For Male', groupSlNo: 6, lowerBound: 1500001, upperBound: 10000000, taxRate: 30 },
    ];
    await IncomeTaxSlab.insertMany(slabs);
    console.log(`Seeded ${slabs.length} Income Tax Slabs`);

    // 2. Seed IT Head Groups
    await ITHeadGroup.deleteMany({});
    const groups = [
      { groupSlNo: 1, groupName: 'House Rent Paid', maxRebateLimit: 0, percentage: 100 },
      { groupSlNo: 2, groupName: 'Interest of loan', maxRebateLimit: 200000, percentage: 100 },
      { groupSlNo: 3, groupName: '80 CC', maxRebateLimit: 150000, percentage: 100 },
      { groupSlNo: 4, groupName: 'Infra Bond', maxRebateLimit: 20000, percentage: 100 },
      { groupSlNo: 5, groupName: '89 I Tax Relief', maxRebateLimit: 0, percentage: 100 },
      { groupSlNo: 6, groupName: 'Other Section', maxRebateLimit: 0, percentage: 100 },
      { groupSlNo: 7, groupName: 'Extra Income', maxRebateLimit: 0, percentage: 100 },
      { groupSlNo: 8, groupName: 'National Pension Scheme', maxRebateLimit: 50000, percentage: 100 },
      { groupSlNo: 9, groupName: 'Other Sec 50', maxRebateLimit: 0, percentage: 50 },
      { groupSlNo: 10, groupName: 'Perq 12B', maxRebateLimit: 0, percentage: 100 }
    ];
    const savedGroups = await ITHeadGroup.insertMany(groups);
    console.log(`Seeded ${savedGroups.length} IT Head Groups`);

    // 3. Seed IT Heads
    await ITHead.deleteMany({});
    const gMap = {};
    savedGroups.forEach(g => { gMap[g.groupName] = g._id; });

    const heads = [
      { groupName: '80 CC', groupId: gMap['80 CC'], slNo: 1, headName: '80C Life Insurance Premium (LIC)', reportName: 'LIC Premium', maxRebateLimit: 150000 },
      { groupName: '80 CC', groupId: gMap['80 CC'], slNo: 2, headName: '80C Public Provident Fund (PPF)', reportName: 'PPF Deposit', maxRebateLimit: 150000 },
      { groupName: '80 CC', groupId: gMap['80 CC'], slNo: 3, headName: '80C Children Tuition Fees', reportName: 'Tuition Fees', maxRebateLimit: 150000 },
      { groupName: '80 CC', groupId: gMap['80 CC'], slNo: 4, headName: '80C National Savings Certificate (NSC)', reportName: 'NSC', maxRebateLimit: 150000 },
      { groupName: 'Other Section', groupId: gMap['Other Section'], slNo: 1, headName: '80D Health Insurance (Mediclaim)', reportName: 'Mediclaim', maxRebateLimit: 25000 },
      { groupName: 'National Pension Scheme', groupId: gMap['National Pension Scheme'], slNo: 1, headName: '80CCD(1B) NPS Additional Contribution', reportName: 'NPS Tier 1', maxRebateLimit: 50000 },
      { groupName: 'Interest of loan', groupId: gMap['Interest of loan'], slNo: 1, headName: 'Section 24(b) Housing Loan Interest', reportName: 'Home Loan Interest', maxRebateLimit: 200000 },
      { groupName: 'Interest of loan', groupId: gMap['Interest of loan'], slNo: 2, headName: 'Section 80E Higher Education Loan Interest', reportName: 'Education Loan', maxRebateLimit: 0 },
      { groupName: 'House Rent Paid', groupId: gMap['House Rent Paid'], slNo: 1, headName: 'Section 10(13A) House Rent Allowance Exemption', reportName: 'HRA Exemption', maxRebateLimit: 0 },
      { groupName: 'Other Section', groupId: gMap['Other Section'], slNo: 2, headName: 'Section 80G Donations to Charitable Institutions', reportName: 'Charity 80G', maxRebateLimit: 0 }
    ];
    await ITHead.insertMany(heads);
    console.log(`Seeded ${heads.length} IT Heads`);

    // 4. Seed TDS Deductee (With "Ayup Tech")
    await TDSDeductee.deleteMany({});
    const deductees = [
      {
        name: 'Ayup Tech',
        fatherName: 'Mohammad Khan',
        designation: 'Principal',
        place: 'Gorakhpur',
        pan: 'AYUPK1234F',
        tan: 'GKPAY12345T',
        isPrimary: true
      },
      {
        name: 'Sunita Sharma',
        fatherName: 'Ramesh Sharma',
        designation: 'Accountant',
        place: 'Gorakhpur',
        pan: 'SUNIS5678G',
        tan: 'GKPSU67890T',
        isPrimary: false
      }
    ];
    await TDSDeductee.insertMany(deductees);
    console.log(`Seeded ${deductees.length} TDS Deductees (Primary: Ayup Tech)`);

    // 5. Relate IT Slab To Staff for "Ayup Khan"
    const ayup = await Staff.findOne({
      $or: [
        { userName: 'SF072' },
        { firstName: /ayup/i }
      ]
    });

    if (ayup) {
      ayup.taxRegime = 'Tax payable in New Regime';
      ayup.itSlabGroup = 'For Male';
      await ayup.save();
      console.log(`Updated Staff "${ayup.firstName} ${ayup.lastName}" (${ayup.userName}) -> Tax Regime: "Tax payable in New Regime", Group: "For Male"`);
    } else {
      console.log('Ayup Khan staff not found; updating first staff member');
      const firstStaff = await Staff.findOne();
      if (firstStaff) {
        firstStaff.taxRegime = 'Tax payable in New Regime';
        firstStaff.itSlabGroup = 'For Male';
        await firstStaff.save();
      }
    }

    console.log('\n--- ALL TDS CONFIGURATION SEED DATA INJECTED SUCCESSFULLY ---');
    process.exit(0);
  } catch (err) {
    console.error('Error during seeding:', err);
    process.exit(1);
  }
})();
