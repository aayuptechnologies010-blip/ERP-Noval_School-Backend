require('dotenv').config();
const mongoose = require('mongoose');
const PayScale = require('./models/payScaleModel');
const PayScaleAmount = require('./models/payScaleAmountModel');
const GradePay = require('./models/gradePayModel');
const Fixation = require('./models/fixationModel');
const Staff = require('./models/staffModel');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB for Pay Scale Configuration seeding...');

    // 1. Seed Pay Scales
    await PayScale.deleteMany({});
    const scales = [
      { scale: '5300-150-10500', modifyDate: new Date('2016-07-21') },
      { scale: '5300-125-9800', modifyDate: new Date('2016-07-21') },
      { scale: '9300-34800', modifyDate: new Date('2018-04-10') },
      { scale: '15600-39100', modifyDate: new Date('2018-05-15') },
      { scale: '37400-67000', modifyDate: new Date('2019-01-01') },
      { scale: 'Ayup Tech Scale 9300-34800', modifyDate: new Date() }
    ];
    await PayScale.insertMany(scales);
    console.log(`Seeded ${scales.length} Pay Scales`);

    // 2. Seed Pay Scale Amounts
    await PayScaleAmount.deleteMany({});
    const amounts = [
      { scale: '5300-125-9800', amount: 5300, modifyDate: new Date('2018-06-23') },
      { scale: '5300-125-9800', amount: 5400, modifyDate: new Date('2018-04-10') },
      { scale: '5300-150-10500', amount: 5200, modifyDate: new Date('2016-07-21') },
      { scale: '5300-150-10500', amount: 5350, modifyDate: new Date('2017-01-15') },
      { scale: '9300-34800', amount: 9300, modifyDate: new Date('2018-04-10') },
      { scale: '9300-34800', amount: 9600, modifyDate: new Date('2018-04-10') },
      { scale: '9300-34800', amount: 34800, modifyDate: new Date('2018-04-10') },
      { scale: 'Ayup Tech Scale 9300-34800', amount: 9300, modifyDate: new Date() }
    ];
    await PayScaleAmount.insertMany(amounts);
    console.log(`Seeded ${amounts.length} Pay Scale Amounts`);

    // 3. Seed Grade Pays
    await GradePay.deleteMany({});
    const gradePays = [
      { amount: 2000, modifyDate: new Date('2017-06-12') },
      { amount: 2400, modifyDate: new Date('2016-07-21') },
      { amount: 2600, modifyDate: new Date('2016-07-21') },
      { amount: 2800, modifyDate: new Date('2016-07-21') },
      { amount: 4200, modifyDate: new Date('2016-07-21') },
      { amount: 4600, modifyDate: new Date('2016-07-21') },
      { amount: 4800, modifyDate: new Date('2016-07-21') },
      { amount: 5400, modifyDate: new Date('2018-03-01') }
    ];
    await GradePay.insertMany(gradePays);
    console.log(`Seeded ${gradePays.length} Grade Pays`);

    // 4. Seed Fixations
    await Fixation.deleteMany({});
    const fixations = [
      { scale: '5300-125-9800', basicPercent: 50.00, daPercent: 21.00, gradePay: 2400.00, payScaleAmount: 5300.00 },
      { scale: '5300-125-9800', basicPercent: 15.00, daPercent: 2.00, gradePay: 2600.00, payScaleAmount: 5300.00 },
      { scale: '5300-150-10500', basicPercent: 50.00, daPercent: 24.00, gradePay: 2800.00, payScaleAmount: 5200.00 },
      { scale: '5300-125-9800', basicPercent: 50.00, daPercent: 21.00, gradePay: 4600.00, payScaleAmount: 5300.00 },
      { scale: '9300-34800', basicPercent: 50.00, daPercent: 28.00, gradePay: 4600.00, payScaleAmount: 9300.00 },
      { scale: 'Ayup Tech Scale 9300-34800', basicPercent: 50.00, daPercent: 28.00, gradePay: 4600.00, payScaleAmount: 9300.00 }
    ];
    await Fixation.insertMany(fixations);
    console.log(`Seeded ${fixations.length} Fixations`);

    // 5. Assign Pay Scale to "Ayup Tech"
    const ayup = await Staff.findOne({
      $or: [
        { userName: 'SF072' },
        { firstName: /ayup/i }
      ]
    });

    if (ayup) {
      ayup.payScale = '9300-34800';
      ayup.gradePay = 4600;
      ayup.basicSalary = 34800;
      ayup.payScaleAmount = 9300;
      await ayup.save();
      console.log(`Updated Staff "${ayup.firstName} ${ayup.lastName}" (${ayup.userName}) -> Pay Scale: "9300-34800", Grade Pay: 4600, Basic Salary: 34800`);
    } else {
      console.log('Ayup Khan staff not found; updating first staff member');
      const firstStaff = await Staff.findOne();
      if (firstStaff) {
        firstStaff.payScale = '9300-34800';
        firstStaff.gradePay = 4600;
        firstStaff.basicSalary = 34800;
        firstStaff.payScaleAmount = 9300;
        await firstStaff.save();
      }
    }

    console.log('\n--- ALL PAY SCALE CONFIGURATION SEED DATA INJECTED SUCCESSFULLY ---');
    process.exit(0);
  } catch (err) {
    console.error('Error during pay scale seeding:', err);
    process.exit(1);
  }
})();
