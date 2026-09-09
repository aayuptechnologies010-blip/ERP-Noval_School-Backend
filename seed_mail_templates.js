require('dotenv').config();
const mongoose = require('mongoose');
const MailTemplate = require('./models/mailTemplateModel');

const MONGO_URI = process.env.MONGO_URI || process.env.MONGODB_URI;

(async () => {
  await mongoose.connect(MONGO_URI);
  console.log('MongoDB connected');

  const templates = [
    { type: 'Fee Deposition', emailContent: 'Dear Parent, Fee of Rs. {amount} has been deposited for {studentName}. Receipt No: {receiptNo}. Thank you.', active: true },
    { type: 'Salary SMS', emailContent: 'Dear {staffName}, Your salary of Rs. {amount} for the month of {month} has been credited to your bank account.', active: true },
    { type: 'Admission SMS', emailContent: 'Congratulations! {studentName} has been admitted to Class {class}. Admission No: {admissionNo}.', active: true },
    { type: 'Registration SMS', emailContent: 'Dear Parent, Registration for {studentName} is confirmed. Registration No: {regNo}. Please complete the admission process.', active: true },
    { type: 'Cheque Bounce', emailContent: 'Dear Parent, The cheque (No: {chequeNo}) of Rs. {amount} for {studentName} has been bounced. Please pay via alternative method.', active: true },
    { type: 'Defaulter SMS', emailContent: 'Dear Parent, Fee of Rs. {amount} is pending for {studentName}. Please pay before {dueDate} to avoid late fee charges.', active: true },
    { type: 'Bill Generation', emailContent: 'Dear {vendorName}, A new bill of Rs. {amount} has been generated. Bill No: {billNo}. Date: {date}.', active: true },
    { type: 'Vehicle Fitness', emailContent: 'Vehicle {vehicleNo} fitness certificate is expiring on {expiryDate}. Please renew immediately.', active: false },
  ];

  // Clear existing
  await MailTemplate.deleteMany({});
  const result = await MailTemplate.insertMany(templates);
  console.log(`✅ Inserted ${result.length} mail templates`);

  await mongoose.disconnect();
  console.log('Done!');
})();
