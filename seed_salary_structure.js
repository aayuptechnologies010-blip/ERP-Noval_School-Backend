require('dotenv').config();
const mongoose = require('mongoose');

const SalaryHead = require('./models/salaryHeadModel');
const RelateStaticDynamicHead = require('./models/relateStaticDynamicHeadModel');
const SalaryGroup = require('./models/salaryGroupModel');
const CPCLevel = require('./models/cpcLevelModel');
const HeadRemark = require('./models/headRemarkModel');
const Staff = require('./models/staffModel');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

(async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected for Salary Structure seeding');

    // 1. Seed Salary Heads
    await SalaryHead.deleteMany({});
    const headsData = [
      { serial: 1, head: 'Dearness Allowance', report: 'DA', type: 'Allowance', lwp: true, ot: false, vType: 'Total Basic %', show: true, val: '95.00' },
      { serial: 2, head: 'House Rent Allowance', report: 'HRA', type: 'Allowance', lwp: false, ot: false, vType: 'Total Basic %', show: true, val: '5.00' },
      { serial: 3, head: 'Transport Allowance', report: 'TA', type: 'Allowance', lwp: false, ot: false, vType: 'Fixed', show: true, val: '1600.00' },
      { serial: 4, head: 'Medical Allowance', report: 'MA', type: 'Allowance', lwp: false, ot: false, vType: 'Fixed', show: true, val: '75.00' },
      { serial: 5, head: 'City expenses', report: 'CCA', type: 'Allowance', lwp: false, ot: false, vType: 'Fixed', show: false, val: '300.00' },
      { serial: 6, head: 'Other Allowances', report: 'Other All', type: 'Allowance', lwp: false, ot: false, vType: 'Occasional', show: true, val: '0.00' },
      { serial: 7, head: 'Basic Arrear', report: 'Basic Arr', type: 'Allowance', lwp: false, ot: false, vType: 'Occasional', show: false, val: '0.00' },
      { serial: 8, head: 'Dearness Allowance Arrear', report: 'DA Arr', type: 'Allowance', lwp: false, ot: false, vType: 'Occasional', show: false, val: '0.00' },
      { serial: 9, head: 'House Rent Allowance Arrear', report: 'HRA Arr', type: 'Allowance', lwp: false, ot: false, vType: 'Occasional', show: false, val: '0.00' },
      { serial: 10, head: 'Transport Allowance Arrear', report: 'TA Arr', type: 'Allowance', lwp: false, ot: false, vType: 'Occasional', show: false, val: '0.00' },
      { serial: 11, head: 'Provident Fund', report: 'PF', type: 'Deduction', lwp: true, ot: false, vType: 'Custom', show: true, val: '12.00' },
      { serial: 12, head: 'Employee State Insurance', report: 'ESI', type: 'Deduction', lwp: true, ot: false, vType: 'Percentage', show: true, val: '1.75' },
      { serial: 13, head: 'Income Tax', report: 'TDS', type: 'Deduction', lwp: false, ot: false, vType: 'Occasional', show: true, val: '0.00' },
      { serial: 14, head: 'Advance Recovery', report: 'Adv Rec', type: 'Deduction', lwp: false, ot: false, vType: 'Occasional', show: true, val: '0.00' }
    ];
    const createdHeads = await SalaryHead.insertMany(headsData);
    console.log(`✅ Seeded ${createdHeads.length} Salary Heads`);

    // 2. Seed Relate Static Dynamic Heads
    await RelateStaticDynamicHead.deleteMany({});
    const relationsData = [
      { staticHead: 'Basic Arrear', dynamicHead: 'Basic Arrear', selected: true },
      { staticHead: 'DA Arrear', dynamicHead: 'Dearness Allowance Arrear', selected: true },
      { staticHead: 'I-Tax', dynamicHead: 'Income Tax', selected: true },
      { staticHead: 'PF. Arrear', dynamicHead: 'NA', selected: false },
      { staticHead: 'Advance Recover', dynamicHead: 'Advance Recovery', selected: true },
      { staticHead: 'T.A', dynamicHead: 'Transport Allowance', selected: true },
      { staticHead: 'PF', dynamicHead: 'Provident Fund', selected: true, highlighted: true },
      { staticHead: 'HRA', dynamicHead: 'House Rent Allowance', selected: true, highlighted: true },
      { staticHead: 'DA', dynamicHead: 'Dearness Allowance', selected: true },
      { staticHead: 'VOL.PF', dynamicHead: 'NA', selected: false },
      { staticHead: 'Bonus', dynamicHead: 'NA', selected: false },
      { staticHead: 'TA on DA', dynamicHead: 'NA', selected: false },
      { staticHead: 'TA ARREAR', dynamicHead: 'Transport Allowance Arrear', selected: true }
    ];
    await RelateStaticDynamicHead.insertMany(relationsData);
    console.log(`✅ Seeded ${relationsData.length} Static-Dynamic Head Relations`);

    // 3. Seed Salary Groups with heads
    await SalaryGroup.deleteMany({});
    const sampleGroupHeads = createdHeads.map(h => ({
      headId: h._id,
      headName: h.head,
      val: h.val,
      vType: h.vType,
      selected: ['Dearness Allowance', 'House Rent Allowance', 'Transport Allowance', 'Medical Allowance', 'Provident Fund'].includes(h.head)
    }));

    const groupsData = [
      { groupName: 'Hourly Group', basicFrom: 500, basicTo: 1000, gradePay: 0, payScale: '0.00', heads: sampleGroupHeads },
      { groupName: 'PB-00 00', basicFrom: 0, basicTo: 0, gradePay: 0, payScale: '0.00', heads: sampleGroupHeads },
      { groupName: 'PB-01 18', basicFrom: 5200, basicTo: 20200, gradePay: 1800, payScale: '5200-20200', heads: sampleGroupHeads },
      { groupName: 'PB-02 19', basicFrom: 5200, basicTo: 20200, gradePay: 1900, payScale: '5200-20200', heads: sampleGroupHeads },
      { groupName: 'PB-03 20', basicFrom: 5200, basicTo: 20200, gradePay: 2000, payScale: '5200-20200', heads: sampleGroupHeads },
      { groupName: 'PB-04 24', basicFrom: 5200, basicTo: 20200, gradePay: 2400, payScale: '5200-20200', heads: sampleGroupHeads },
      { groupName: 'PB-05 26', basicFrom: 5200, basicTo: 20200, gradePay: 2660, payScale: '5200-20200', heads: sampleGroupHeads },
      { groupName: 'PB-06 28', basicFrom: 5200, basicTo: 20200, gradePay: 2800, payScale: '5200-20200', heads: sampleGroupHeads },
      { groupName: 'PB-07 42', basicFrom: 9300, basicTo: 34800, gradePay: 4200, payScale: '9300-34800', heads: sampleGroupHeads },
      { groupName: 'PB-08 46', basicFrom: 9300, basicTo: 34800, gradePay: 4600, payScale: '9300-34800', heads: sampleGroupHeads }
    ];
    await SalaryGroup.insertMany(groupsData);
    console.log(`✅ Seeded ${groupsData.length} Salary Groups with Heads`);

    // 4. Seed 7th CPC Levels with 40 cells each
    await CPCLevel.deleteMany({});
    const cpcBase = [
      { level: 'Level 1', order: 1, base: 18000 },
      { level: 'Level 2', order: 2, base: 19900 },
      { level: 'Level 3', order: 3, base: 21700 },
      { level: 'Level 4', order: 4, base: 25500 },
      { level: 'Level 5', order: 5, base: 29200 },
      { level: 'Level 6', order: 6, base: 35400 },
      { level: 'Level 7', order: 7, base: 44900 },
      { level: 'Level 8', order: 8, base: 47600 },
      { level: 'Level 9', order: 9, base: 53100 },
      { level: 'Level 10', order: 10, base: 56100 }
    ];

    const cpcDocs = cpcBase.map(item => {
      const cells = [];
      for (let c = 1; c <= 40; c++) {
        const amt = Math.round(item.base * Math.pow(1.03, c - 1) / 100) * 100;
        cells.push({ cellIndex: c, amount: amt });
      }
      return {
        cpcLevel: item.level,
        orderNo: item.order,
        noOfCells: 40,
        amount: item.base,
        cells,
        isActive: true
      };
    });
    await CPCLevel.insertMany(cpcDocs);
    console.log(`✅ Seeded ${cpcDocs.length} 7th CPC Levels with pay matrix cells`);

    // 5. Update Ayup Khan with Salary Group and Remarks
    const ayup = await Staff.findOne({ userName: 'SF072' });
    if (ayup) {
      ayup.salaryGroup = 'PB-08 46';
      await ayup.save();

      await HeadRemark.deleteMany({});
      await HeadRemark.create({
        staffId: ayup._id,
        staffName: `${ayup.firstName} ${ayup.lastName}`,
        staffCode: ayup.userName,
        salaryMonth: 'April 2026',
        salaryHead: 'Dearness Allowance',
        amount: 500,
        remark: 'Annual performance incentive addition for Ayup'
      });
      console.log('✅ Updated Ayup Khan with Salary Group PB-08 46 and test Head Remark');
    }

    console.log('\n🎉 ALL SALARY STRUCTURE DATA SEEDED SUCCESSFULLY!');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding salary structure data:', err);
    process.exit(1);
  }
})();
