const jwt = require('jsonwebtoken');
require('dotenv').config();
const mongoose = require('mongoose');

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log('Connected to DB');

  const Admin = require('./models/adminModel');
  let admin = await Admin.findOne({});
  if (!admin) {
    admin = await Admin.create({
      firstName: 'Curl',
      lastName: 'Admin',
      userId: 'curladmin123',
      password: 'password123',
    });
  }

  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
  mongoose.disconnect();

  const cmds = [
    'curl -s -X POST http://localhost:5005/api/professions -H "Content-Type: application/json" -H "Authorization: Bearer ' + token + '" -d "{\\"name\\": \\"Curl Profession Test\\"}"',
    'curl -s -X POST http://localhost:5005/api/academic-years -H "Content-Type: application/json" -H "Authorization: Bearer ' + token + '" -d "{\\"name\\": \\"Curl Acad Year Test\\", \\"isActive\\": true, \\"startDate\\": \\"01-Apr-2026\\", \\"endDate\\": \\"31-Mar-2027\\"}"',
    'curl -s -X POST http://localhost:5005/api/financial-years -H "Content-Type: application/json" -H "Authorization: Bearer ' + token + '" -d "{\\"name\\": \\"Curl Fin Year Test\\", \\"isActive\\": true, \\"startDate\\": \\"01-Apr-2026\\", \\"endDate\\": \\"31-Mar-2027\\"}"'
  ];

  const { execSync } = require('child_process');

  for (const cmd of cmds) {
    console.log('Running:', cmd);
    try {
      const out = execSync(cmd).toString();
      console.log('Response:', out);
    } catch (e) {
      console.error('Error:', e.message);
    }
  }
}

run();
