const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const uri = 'mongodb+srv://aayuptechnologies_db_user:t9a4mbgdpwlGUIzP@cluster0.xkwgx1b.mongodb.net/ERP-NovalSchool?appName=Cluster0';

async function check() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  console.log('=== ADMIN COLLECTION ===');
  const admins = await db.collection('admins').find({}).toArray();
  for (const a of admins) {
    let match78667 = false;
    if (a.password) {
      try { match78667 = await bcrypt.compare('78667', a.password); } catch(e){}
    }
    console.log(`Admin -> userId: "${a.userId}", email: "${a.email}", name: "${a.firstName} ${a.lastName}", passMatch_78667: ${match78667}`);
  }

  console.log('\n=== SEARCHING sf032 in STAFFS ===');
  const staffQuery = await db.collection('staffs').find({
    $or: [
      { userName: { $regex: 'sf032', $options: 'i' } },
      { staffCode: { $regex: 'sf032', $options: 'i' } },
      { empId: { $regex: 'sf032', $options: 'i' } }
    ]
  }).toArray();

  console.log(`Staff matches found for sf032: ${staffQuery.length}`);
  for (const s of staffQuery) {
    let match78667 = false;
    if (s.password) {
      try { match78667 = await bcrypt.compare('78667', s.password); } catch(e){}
    }
    console.log(`Staff -> _id: ${s._id}, userName: "${s.userName}", staffCode: "${s.staffCode}", name: "${s.firstName} ${s.lastName}", mobile: "${s.mobileNo}", passMatch_78667: ${match78667}, rawPasswordExists: ${!!s.password}`);
  }

  console.log('\n=== SAMPLE STAFF LIST (First 10) ===');
  const sampleStaff = await db.collection('staffs').find({}).limit(10).toArray();
  for (const s of sampleStaff) {
    console.log(`Staff -> userName: "${s.userName}", staffCode: "${s.staffCode}", name: "${s.firstName} ${s.lastName}", mobile: "${s.mobileNo}"`);
  }

  await mongoose.disconnect();
}

check().catch(console.error);
