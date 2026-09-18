const mongoose = require('mongoose');

const uri = 'mongodb+srv://aayuptechnologies_db_user:t9a4mbgdpwlGUIzP@cluster0.xkwgx1b.mongodb.net/ERP-NovalSchool?appName=Cluster0';

async function getLiveStudents() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;

  const students = await db.collection('students').find({}).limit(8).toArray();
  
  console.log('\n--- REAL STUDENTS DATA FOR TESTING ---');
  students.forEach((s, index) => {
    const p = s.personalDetails || {};
    const a = s.academicDetails || {};
    const c = s.contactAddress || {};
    const f = (s.familyDetails && s.familyDetails.father) || {};
    
    console.log(`${index + 1}. Adm No: "${a.admissionNumber}" | Name: "${p.firstName} ${p.lastName}" | Class: "${a.class}" (${a.section}) | Father: "${f.firstName || ''} ${f.lastName || ''}" | Mobile: "${c.contactNumber || f.mobile || ''}"`);
  });

  await mongoose.disconnect();
}

getLiveStudents().catch(console.error);
