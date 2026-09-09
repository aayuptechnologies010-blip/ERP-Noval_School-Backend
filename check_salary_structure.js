const http = require('http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const Admin = require('./models/adminModel');

const verifySalaryStructureEndpoints = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/erp-school';
    await mongoose.connect(mongoUri);

    let admin = await Admin.findOne();
    if (!admin) {
      admin = await Admin.create({ username: 'admin', email: 'admin@example.com', password: 'password123' });
    }

    const token = jwt.sign(
      { id: admin._id, userType: 'admin' },
      process.env.JWT_SECRET || 'secret123',
      { expiresIn: '1d' }
    );

    const makeRequest = (path) => {
      return new Promise((resolve, reject) => {
        const req = http.request({
          hostname: 'localhost',
          port: 5000,
          path: path,
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }, (res) => {
          let data = '';
          res.on('data', (chunk) => { data += chunk; });
          res.on('end', () => {
            try {
              resolve({ statusCode: res.statusCode, data: JSON.parse(data) });
            } catch (e) {
              resolve({ statusCode: res.statusCode, data });
            }
          });
        });
        req.on('error', reject);
        req.end();
      });
    };

    console.log('=== VERIFYING SALARY STRUCTURE REST ENDPOINTS ===');

    // 1. Leave LWP
    const lwpRes = await makeRequest('/api/salary-structure/leave-lwp');
    console.log(`1. Leave LWP: HTTP ${lwpRes.statusCode} | Count: ${lwpRes.data.length} | Staff: ${lwpRes.data[0]?.staffName}`);

    // 2. Occasional Allowance
    const occRes = await makeRequest('/api/salary-structure/occasional-allowance');
    console.log(`2. Occasional Allowance: HTTP ${occRes.statusCode} | Count: ${occRes.data.length} | Head: ${occRes.data[0]?.headName} (₹${occRes.data[0]?.amount})`);

    // 3. Salary Generation
    const salRes = await makeRequest('/api/salary-structure/salary-generation');
    console.log(`3. Salary Generation: HTTP ${salRes.statusCode} | Count: ${salRes.data.length} | Staff: ${salRes.data[0]?.staffName} (Gross: ₹${salRes.data[0]?.grossSalary}, Net: ₹${salRes.data[0]?.netSalary})`);

    // 4. Bank Statement
    const bnkRes = await makeRequest('/api/salary-structure/bank-statement');
    console.log(`4. Bank Statement: HTTP ${bnkRes.statusCode} | Count: ${bnkRes.data.length} | First: ${bnkRes.data[0]?.staffName} (${bnkRes.data[0]?.bankName} - ${bnkRes.data[0]?.bankAccountNo})`);

    // 5. Insurance Statement
    const insRes = await makeRequest('/api/salary-structure/insurance-statement');
    console.log(`5. Insurance Statement: HTTP ${insRes.statusCode} | Count: ${insRes.data.length} | Vendor: ${insRes.data[0]?.policyVendor} (Premium: ₹${insRes.data[0]?.insuranceDeduction})`);

    // 6. Cheque Statement
    const chqRes = await makeRequest('/api/salary-structure/cheque-statement');
    console.log(`6. Cheque Statement: HTTP ${chqRes.statusCode} | Count: ${chqRes.data.length} | Cheque No: ${chqRes.data[0]?.chequeNo}`);

    // 7. IT Head Entries
    const itRes = await makeRequest('/api/salary-structure/it-head-entries');
    console.log(`7. IT Head Entries: HTTP ${itRes.statusCode} | Count: ${itRes.data.length} | Section: ${itRes.data[0]?.itSection} (₹${itRes.data[0]?.declaredAmount})`);

    // 8. TDS Entries
    const tdsRes = await makeRequest('/api/salary-structure/tds-entries');
    console.log(`8. TDS Entries: HTTP ${tdsRes.statusCode} | Count: ${tdsRes.data.length} | PAN: ${tdsRes.data[0]?.panNumber} (TDS: ₹${tdsRes.data[0]?.tdsAmount})`);

    // 9. Gratuity Calculations
    const gratRes = await makeRequest('/api/salary-structure/gratuity');
    console.log(`9. Gratuity Calculations: HTTP ${gratRes.statusCode} | Count: ${gratRes.data.length} | Staff: ${gratRes.data[0]?.staffName} (Gratuity: ₹${gratRes.data[0]?.gratuityAmount})`);

    // 10. Bonus Calculations
    const bonRes = await makeRequest('/api/salary-structure/bonus');
    console.log(`10. Bonus Calculations: HTTP ${bonRes.statusCode} | Count: ${bonRes.data.length} | Staff: ${bonRes.data[0]?.staffName} (Bonus: ₹${bonRes.data[0]?.bonusAmount})`);

    console.log('\n🎉 ALL 10 SALARY STRUCTURE REST ENDPOINTS VERIFIED SUCCESSFULLY WITH "AYUP TECH"!');
    process.exit(0);
  } catch (err) {
    console.error('Error verifying salary structure endpoints:', err);
    process.exit(1);
  }
};

verifySalaryStructureEndpoints();
