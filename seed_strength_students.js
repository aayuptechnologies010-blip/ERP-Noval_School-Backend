const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  const Student = require('./models/studentModel');
  const students = await Student.find({});
  console.log(`Found ${students.length} students to enrich.`);

  const religions = ['Hindu', 'Muslim', 'Christian', 'Sikh'];
  const categories = ['General', 'OBC', 'SC', 'ST'];
  const routes = ['Route 1 - Dohrighat Market', 'Route 2 - Ghosi Highway', 'Route 3 - Indara Station'];

  for (let i = 0; i < students.length; i++) {
    const s = students[i];
    const fullName = `${s.personalDetails?.firstName || ''} ${s.personalDetails?.lastName || ''}`.trim();
    const isAayup = fullName.toLowerCase().includes('aayup');

    if (!s.personalDetails) s.personalDetails = {};
    if (!s.academicDetails) s.academicDetails = {};
    if (!s.contactAddress) s.contactAddress = {};

    if (isAayup) {
      s.personalDetails.religion = 'Hindu';
      s.personalDetails.caste = 'General';
      s.personalDetails.nationality = 'Indian';
      s.personalDetails.boardingHostel = 'Day Scholar';
      s.personalDetails.isEwsCwsn = 'Yes';
      s.contactAddress.currentAddress = 'Route 1 - Dohrighat Market';
      s.contactAddress.city = 'Dohrighat';
    } else {
      if (!s.personalDetails.religion || s.personalDetails.religion === 'undefined') {
        s.personalDetails.religion = religions[i % religions.length];
      }
      if (!s.personalDetails.caste || s.personalDetails.caste === 'undefined') {
        s.personalDetails.caste = categories[i % categories.length];
      }
      if (!s.personalDetails.nationality) {
        s.personalDetails.nationality = 'Indian';
      }
      if (!s.personalDetails.boardingHostel || s.personalDetails.boardingHostel === 'No') {
        s.personalDetails.boardingHostel = i % 3 === 0 ? 'Hosteller' : 'Day Scholar';
      }
      if (!s.personalDetails.isEwsCwsn) {
        s.personalDetails.isEwsCwsn = i % 2 === 0 ? 'Yes' : 'No';
      }
      if (!s.contactAddress.currentAddress) {
        s.contactAddress.currentAddress = routes[i % routes.length];
      }
    }

    await s.save();
    console.log(`Updated [${s._id}]: ${fullName} -> Rel: ${s.personalDetails.religion}, Cat: ${s.personalDetails.caste}, Hostel: ${s.personalDetails.boardingHostel}, EWS: ${s.personalDetails.isEwsCwsn}`);
  }

  console.log('All students enriched successfully!');
  process.exit(0);
})
.catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
