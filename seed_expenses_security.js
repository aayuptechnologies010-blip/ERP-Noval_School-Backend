const mongoose = require('mongoose');
require('dotenv').config();
const Student = require('./models/studentModel');
const StudentExpense = require('./models/studentExpenseModel');
const SecurityMoney = require('./models/securityMoneyModel');

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  const students = await Student.find().limit(35).lean();

  const expenseHeads = ['Sports Kit', 'Annual Excursion', 'Lab Breakage', 'Exam Board Fee', 'Uniform & Identity'];
  const expenses = [];
  const securities = [];

  students.forEach((s, idx) => {
    // 1-2 expenses
    expenses.push({
      student: s._id,
      expenseHead: expenseHeads[idx % expenseHeads.length],
      amount: 450 + (idx * 50),
      date: new Date(2026, 7 + (idx % 3), 5 + (idx % 20)),
      remarks: `Academic session expense for ${s.academicDetails?.admissionNumber || 'student'}`
    });

    // Security money deposit
    securities.push({
      student: s._id,
      amount: 2500,
      status: idx % 6 === 0 ? 'Returned' : 'Deposited',
      receiptNo: `SEC-2026-${String(idx + 1).padStart(4, '0')}`,
      depositDate: new Date(2026, 6, 10 + (idx % 15)),
      returnDate: idx % 6 === 0 ? new Date(2026, 9, 1) : null,
      paymentMode: idx % 2 === 0 ? 'Cash' : 'Online',
      remarks: idx % 6 === 0 ? 'Security refunded upon session completion' : 'Caution money deposited at admission'
    });
  });

  await StudentExpense.deleteMany({});
  await SecurityMoney.deleteMany({});
  await StudentExpense.insertMany(expenses);
  await SecurityMoney.insertMany(securities);

  console.log(`Successfully seeded ${expenses.length} student expenses and ${securities.length} security money deposits.`);
  process.exit(0);
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
