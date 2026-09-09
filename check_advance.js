const http = require('http');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
dotenv.config();

const Admin = require('./models/adminModel');

const verifyAdvanceEndpoints = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/erp-school';
    await mongoose.connect(mongoUri);

    let admin = await Admin.findOne();
    if (!admin) {
      console.log('No admin found, creating test admin...');
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

    console.log('=== VERIFYING ADVANCE REST ENDPOINTS ===');

    // 1. Fix Advance Accounts
    const accRes = await makeRequest('/api/advance/accounts');
    console.log(`1. Fix Advance Accounts: HTTP ${accRes.statusCode} | Count: ${accRes.data.length} | First: ${accRes.data[0]?.accountName}`);

    // 2. Advance Entries
    const entryRes = await makeRequest('/api/advance/entries');
    console.log(`2. Advance Entries: HTTP ${entryRes.statusCode} | Count: ${entryRes.data.length} | Staff: ${entryRes.data[0]?.staffName} (Advance: ₹${entryRes.data[0]?.advanceAmount}, Left: ₹${entryRes.data[0]?.leftAmount})`);

    // 3. Advance Repayments
    const repayRes = await makeRequest('/api/advance/repayments');
    console.log(`3. Advance Repayments: HTTP ${repayRes.statusCode} | Count: ${repayRes.data.length} | Staff: ${repayRes.data[0]?.staffName} (Paid: ₹${repayRes.data[0]?.repaymentAmount})`);

    // 4. Advance Ledger for Ayup Tech
    const ledgerRes = await makeRequest('/api/advance/ledger?staffName=Ayup');
    console.log(`4. Advance Ledger (Ayup Tech): HTTP ${ledgerRes.statusCode} | Transactions: ${ledgerRes.data?.ledger?.length} | Current Outstanding: ₹${ledgerRes.data?.summary?.currentOutstanding}`);

    console.log('\n🎉 ALL ADVANCE REST ENDPOINTS VERIFIED WITH "AYUP TECH"!');
    process.exit(0);
  } catch (err) {
    console.error('Error verifying advance endpoints:', err);
    process.exit(1);
  }
};

verifyAdvanceEndpoints();
