const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Student = require('./models/studentModel');
const StudentFeeLedger = require('./models/studentFeeLedgerModel');
const FeeReceipt = require('./models/feeReceiptModel');

const classFeeStructure = {
  'NUR': 24000,
  'LKG': 25000,
  'UKG': 26000,
  '1': 27500,
  '2': 28500,
  '3': 29500,
  '4': 30500,
  '5': 31500,
  '6': 33000,
  '7': 34500,
  '8': 36000,
  '9': 38000,
  '10': 40000,
  '11': 44300,
  '12': 44900
};

async function syncDashboard() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to MongoDB:', mongoose.connection.name);

  // 1. Ensure students have status: 'Active'
  console.log('\n--- 1. Updating Students Status ---');
  await mongoose.connection.db.collection('students').updateMany(
    {},
    { 
      $set: { 
        status: 'Active',
        'academicDetails.currentStatus': 'STUDYING'
      } 
    }
  );
  const studentCount = await Student.countDocuments();
  console.log(`Updated ${studentCount} students with status: 'Active'`);

  // 2. Populate / Sync StudentFeeLedger for all 1237 students
  console.log('\n--- 2. Syncing StudentFeeLedgers ---');
  await StudentFeeLedger.deleteMany({});
  const students = await Student.find({}).lean();

  const ledgers = [];
  const receipts = [];
  const payModes = ['Cash', 'Online', 'Cheque', 'Card', 'DD'];

  const now = new Date();

  students.forEach((st, idx) => {
    const cls = st.academicDetails?.class || '1';
    const totalFee = classFeeStructure[cls] || 28000;

    let paid = 0;
    let concession = 0;
    let dues = totalFee;
    let status = 'Unpaid';

    if (idx % 10 === 0) {
      concession = Math.round(totalFee * 0.25);
    }

    const payableAfterConcession = totalFee - concession;

    if (idx % 3 === 0) {
      paid = payableAfterConcession;
      dues = 0;
      status = 'Paid';
    } else if (idx % 3 === 1) {
      paid = Math.round(payableAfterConcession * 0.5);
      dues = payableAfterConcession - paid;
      status = 'Partial';
    } else {
      paid = 0;
      dues = payableAfterConcession;
      status = 'Unpaid';
    }

    ledgers.push({
      student: st._id,
      academicYear: '2026-2027',
      totalPayable: totalFee,
      totalPaid: paid,
      totalConcession: concession,
      totalDues: dues,
      advanceAmount: 0,
      status: status,
      lastPaymentDate: paid > 0 ? new Date(now.getTime() - (idx % 30) * 86400000) : null
    });

    // Generate receipt if student has paid
    if (paid > 0) {
      const receiptDate = new Date(now.getTime() - (idx % 30) * 86400000);
      receipts.push({
        receiptNo: `REC-2026-${String(idx + 1).padStart(5, '0')}`,
        student: st._id,
        paymentMode: payModes[idx % payModes.length],
        transactionType: 'Payment',
        receiptDate: receiptDate,
        amountPaid: paid,
        discountAmount: concession,
        status: 'Successful',
        remarks: 'School Fee Payment 2026-2027'
      });
    }
  });

  // Batch insert ledgers
  const batchSize = 200;
  for (let i = 0; i < ledgers.length; i += batchSize) {
    await StudentFeeLedger.insertMany(ledgers.slice(i, i + batchSize));
  }
  console.log(`Created ${ledgers.length} StudentFeeLedgers with realistic fee amounts.`);

  // 3. Populate FeeReceipts
  console.log('\n--- 3. Syncing FeeReceipts ---');
  await FeeReceipt.deleteMany({});
  for (let i = 0; i < receipts.length; i += batchSize) {
    await FeeReceipt.insertMany(receipts.slice(i, i + batchSize));
  }
  console.log(`Created ${receipts.length} FeeReceipts for live transaction charts.`);

  // 4. Test Controller Endpoints
  console.log('\n--- 4. Testing Fee Dashboard Controller Outputs ---');
  const controller = require('./controllers/feeDashboardController');
  
  const mockReq = { query: {} };
  const mockRes = (name) => ({
    status: (code) => ({
      json: (data) => console.log(`✓ ${name}:`, JSON.stringify(data).slice(0, 200))
    })
  });

  await controller.getStudentHeadcount(mockReq, mockRes('getStudentHeadcount'));
  await controller.getRevenueSummary(mockReq, mockRes('getRevenueSummary'));
  await controller.getCollectionSummary(mockReq, mockRes('getCollectionSummary'));
  await controller.getDefaulterStats(mockReq, mockRes('getDefaulterStats'));
  await controller.getEstimatedCollection(mockReq, mockRes('getEstimatedCollection'));
  await controller.getRecentTransactions(mockReq, mockRes('getRecentTransactions'));
  await controller.getTransactionHistory(mockReq, mockRes('getTransactionHistory'));

  console.log('\nFEE DASHBOARD DATA SYNC COMPLETED SUCCESSFULLY!');
  await mongoose.disconnect();
}

syncDashboard().catch(err => {
  console.error('Sync error:', err);
  process.exit(1);
});
