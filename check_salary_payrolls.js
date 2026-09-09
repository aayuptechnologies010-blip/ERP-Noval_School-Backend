require('dotenv').config();
const mongoose = require('mongoose');
const { SalaryPayroll } = require('./models/salaryStructureModel');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const count = await SalaryPayroll.countDocuments();
    console.log(`Current SalaryPayroll count: ${count}`);
    const ayupRecords = await SalaryPayroll.find({ staffName: { $regex: /Ayup/i } });
    console.log(`Ayup records count: ${ayupRecords.length}`);
    ayupRecords.forEach(r => {
      console.log(`- ${r.staffName} (${r.employeeId}) | Dept: ${r.department} | Gross: ${r.grossSalary} | Net: ${r.netSalary} | Month: ${r.monthYear}`);
    });
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
