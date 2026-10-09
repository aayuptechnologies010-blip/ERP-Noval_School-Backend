const mongoose = require('mongoose');
require('dotenv').config({ path: 'd:/Aayup Projects/ERP-Naval School/backend/ERP-Noval_School-Backend/.env' });
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://navalSchool:1234@erp-novalschool.xixvyba.mongodb.net/test?retryWrites=true&w=majority';

async function check() {
  await mongoose.connect(MONGO_URI);
  const db = mongoose.connection.db;

  const cols = await db.listCollections().toArray();
  const feeRelated = cols.filter(c => /fee|transport/i.test(c.name)).map(c => c.name);
  console.log('Fee & Transport collections:', feeRelated);

  for (const cName of feeRelated) {
    const count = await db.collection(cName).countDocuments();
    const sample = await db.collection(cName).findOne();
    console.log('Collection: ' + cName + ' (count: ' + count + ')');
    console.log(JSON.stringify(sample, null, 2));
  }

  process.exit(0);
}
check();
