const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

// Models
const FeeHead = require('./models/feeHeadModel');
const FeeInstallment = require('./models/feeInstallmentModel');
const FeeGroup = require('./models/feeGroupModel');
const FeeGroupToHead = require('./models/feeGroupToHeadModel');
const FeeAmountGroup = require('./models/feeAmountGroupModel');
const SchoolClass = require('./models/schoolClassModel');

const feeStructureData = [
  { className: 'NURSERY', admission: 1500, composite: 3500, tuitionMonthly: 1200, examHalfYearly: 800, examAnnual: 800, total: 21000 },
  { className: 'L.K.G', admission: 1500, composite: 3500, tuitionMonthly: 1200, examHalfYearly: 800, examAnnual: 800, total: 21000 },
  { className: 'U.K.G', admission: 1500, composite: 3500, tuitionMonthly: 1200, examHalfYearly: 800, examAnnual: 800, total: 21000 },
  { className: 'CLASS - I', admission: 2000, composite: 4500, tuitionMonthly: 1500, examHalfYearly: 800, examAnnual: 800, total: 26100 },
  { className: 'CLASS - II', admission: 2000, composite: 4500, tuitionMonthly: 1500, examHalfYearly: 800, examAnnual: 800, total: 26100 },
  { className: 'CLASS - III', admission: 2000, composite: 5000, tuitionMonthly: 1600, examHalfYearly: 800, examAnnual: 800, total: 27800 },
  { className: 'CLASS - IV', admission: 2000, composite: 5000, tuitionMonthly: 1600, examHalfYearly: 800, examAnnual: 800, total: 27800 },
  { className: 'CLASS - V', admission: 2000, composite: 5000, tuitionMonthly: 1600, examHalfYearly: 800, examAnnual: 800, total: 27800 },
  { className: 'CLASS - VI', admission: 2500, composite: 5500, tuitionMonthly: 1800, examHalfYearly: 900, examAnnual: 900, total: 31400 },
  { className: 'CLASS - VII', admission: 2500, composite: 5500, tuitionMonthly: 1800, examHalfYearly: 900, examAnnual: 900, total: 31400 },
  { className: 'CLASS - VIII', admission: 2500, composite: 5500, tuitionMonthly: 1800, examHalfYearly: 900, examAnnual: 900, total: 31400 },
  { className: 'CLASS - IX', admission: 2500, composite: 6000, tuitionMonthly: 2300, examHalfYearly: 1000, examAnnual: 1000, total: 38100 },
  { className: 'CLASS - X', admission: 0, composite: 6000, tuitionMonthly: 2500, examHalfYearly: 1000, examAnnual: 1000, total: 38000 },
  { className: 'CLASS - XI', admission: 3000, composite: 6500, tuitionMonthly: 2700, examHalfYearly: 1200, examAnnual: 1200, total: 44300 },
  { className: 'CLASS - XII', admission: 0, composite: 6500, tuitionMonthly: 3000, examHalfYearly: 1200, examAnnual: 1200, total: 44900 }
];

const months = [
  'April', 'May', 'June', 'July', 'August', 'September',
  'October', 'November', 'December', 'January', 'February', 'March'
];

async function seed() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected successfully.');

    // 1. Seed / Upsert School Classes
    console.log('Seeding School Classes...');
    for (let i = 0; i < feeStructureData.length; i++) {
      const item = feeStructureData[i];
      await SchoolClass.findOneAndUpdate(
        { className: item.className },
        {
          className: item.className,
          orderNo: i + 1,
          isActive: true
        },
        { upsert: true, new: true }
      );
    }
    console.log('Classes created/updated.');

    // 2. Seed Fee Heads
    console.log('Seeding Fee Heads...');
    const feeHeadsList = [
      { name: 'Admission Fee', printName: 'Admission Fee', type: 'Lifetime', priority: 1, category: 'Regular' },
      { name: 'Composite Fees', printName: 'Composite Fees', type: 'Annual', priority: 2, category: 'Regular' },
      { name: 'Tuition Fees', printName: 'Tuition Fees', type: 'Installment', priority: 3, category: 'Regular' },
      { name: 'Exam Fee (Half Yearly)', printName: 'Exam Fee (Half Yearly)', type: 'Installment', priority: 4, category: 'Regular' },
      { name: 'Exam Fee (Annual)', printName: 'Exam Fee (Annual)', type: 'Installment', priority: 5, category: 'Regular' }
    ];

    const feeHeadDocs = {};
    for (const fh of feeHeadsList) {
      const doc = await FeeHead.findOneAndUpdate(
        { name: fh.name },
        fh,
        { upsert: true, new: true }
      );
      feeHeadDocs[fh.name] = doc;
    }
    console.log('Fee Heads created/updated.');

    // 3. Seed Fee Installments
    console.log('Seeding Installments...');
    const installmentDocs = {};
    for (let i = 0; i < months.length; i++) {
      const m = months[i];
      const doc = await FeeInstallment.findOneAndUpdate(
        { name: m },
        {
          name: m,
          printName: m,
          pref: i + 1,
          dueOnDay: '10',
          dueDay: '10',
          dueOnMonth: m,
          dueMonth: m,
          selectedMonth: m
        },
        { upsert: true, new: true }
      );
      installmentDocs[m] = doc;
    }

    const examInstList = [
      { name: 'Half Yearly Exam', printName: 'Half Yearly Exam', pref: 13, dueOnMonth: 'September', dueMonth: 'September', dueOnDay: '10', dueDay: '10' },
      { name: 'Annual Exam', printName: 'Annual Exam', pref: 14, dueOnMonth: 'February', dueMonth: 'February', dueOnDay: '10', dueDay: '10' }
    ];
    for (const ei of examInstList) {
      const doc = await FeeInstallment.findOneAndUpdate(
        { name: ei.name },
        ei,
        { upsert: true, new: true }
      );
      installmentDocs[ei.name] = doc;
    }
    console.log('Installments created/updated.');

    // 4. Seed Fee Groups & Map Heads & Assign Amounts
    console.log('Seeding Fee Groups, Mappings and Amounts...');
    for (const item of feeStructureData) {
      const groupName = `Fee Group - ${item.className}`;
      const groupDoc = await FeeGroup.findOneAndUpdate(
        { name: groupName },
        { name: groupName, special: 'False' },
        { upsert: true, new: true }
      );

      // Map heads to group
      const mappedHeads = Object.values(feeHeadDocs).map(h => ({
        feeHead: h._id,
        checked: true
      }));

      await FeeGroupToHead.findOneAndUpdate(
        { feeGroup: groupDoc._id },
        {
          feeGroup: groupDoc._id,
          mappedHeads
        },
        { upsert: true, new: true }
      );

      // Assign Amounts:
      // (a) Lifetime / Annual overall (installment: null)
      const overallAmounts = [
        { feeHead: feeHeadDocs['Admission Fee']._id, amount: item.admission },
        { feeHead: feeHeadDocs['Composite Fees']._id, amount: item.composite },
        { feeHead: feeHeadDocs['Tuition Fees']._id, amount: item.tuitionMonthly },
        { feeHead: feeHeadDocs['Exam Fee (Half Yearly)']._id, amount: item.examHalfYearly },
        { feeHead: feeHeadDocs['Exam Fee (Annual)']._id, amount: item.examAnnual }
      ];

      await FeeAmountGroup.findOneAndUpdate(
        { feeGroup: groupDoc._id, installment: null },
        {
          feeGroup: groupDoc._id,
          installment: null,
          amounts: overallAmounts
        },
        { upsert: true, new: true }
      );

      // (b) Monthly installments
      for (const m of months) {
        const instDoc = installmentDocs[m];
        await FeeAmountGroup.findOneAndUpdate(
          { feeGroup: groupDoc._id, installment: instDoc._id },
          {
            feeGroup: groupDoc._id,
            installment: instDoc._id,
            amounts: [
              { feeHead: feeHeadDocs['Tuition Fees']._id, amount: item.tuitionMonthly }
            ]
          },
          { upsert: true, new: true }
        );
      }

      // (c) Exam installments
      await FeeAmountGroup.findOneAndUpdate(
        { feeGroup: groupDoc._id, installment: installmentDocs['Half Yearly Exam']._id },
        {
          feeGroup: groupDoc._id,
          installment: installmentDocs['Half Yearly Exam']._id,
          amounts: [
            { feeHead: feeHeadDocs['Exam Fee (Half Yearly)']._id, amount: item.examHalfYearly }
          ]
        },
        { upsert: true, new: true }
      );

      await FeeAmountGroup.findOneAndUpdate(
        { feeGroup: groupDoc._id, installment: installmentDocs['Annual Exam']._id },
        {
          feeGroup: groupDoc._id,
          installment: installmentDocs['Annual Exam']._id,
          amounts: [
            { feeHead: feeHeadDocs['Exam Fee (Annual)']._id, amount: item.examAnnual }
          ]
        },
        { upsert: true, new: true }
      );

      console.log(`Configured Fee Group for ${item.className} (Total: ₹${item.total})`);
    }

    console.log('\n=============================================');
    console.log('✅ ALL FEE STRUCTURE DATA SEEDED SUCCESSFULLY!');
    console.log('=============================================');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding fee structure:', error);
    process.exit(1);
  }
}

seed();
