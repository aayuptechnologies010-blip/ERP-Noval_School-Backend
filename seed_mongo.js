const mongoose = require('mongoose');

// Connect to MongoDB
mongoose.connect('mongodb+srv://aayuptechnologies_db_user:t9a4mbgdpwlGUIzP@cluster0.xkwgx1b.mongodb.net/ERP-NovalSchool?appName=Cluster0')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => { console.error('Connection error', err); process.exit(1); });

// Create generic schema for all collections we want to touch, just using strict: false
// This allows us to insert whatever fields we want without schema validation blocking it,
// though in real life it will just be stored as given.
const GenericModel = (collectionName) => {
  return mongoose.models[collectionName] || mongoose.model(collectionName, new mongoose.Schema({}, { strict: false }), collectionName);
};

const collectionsAndData = [
  { coll: 'professions', data: { name: 'Aayup Profession', status: true } },
  { coll: 'academicyears', data: { name: 'Aayup 2026-2027', isDefault: true, beginDate: new Date('2026-04-01'), endDate: new Date('2027-03-31'), status: true } },
  { coll: 'financialyears', data: { name: 'Aayup FY 26-27', isDefault: true, beginDate: new Date('2026-04-01'), endDate: new Date('2027-03-31'), status: true } },
  { coll: 'schoolboards', data: { name: 'Aayup Board', isDefault: true, status: true } },
  { coll: 'schoolglobalfeetypes', data: { feeType: 'Aayup Fee Type', isDefault: true, status: true } },
  { coll: 'wings', data: { name: 'Aayup Wing', status: true } },
  { coll: 'schoolclasses', data: { name: 'Aayup Class', status: true } },
  { coll: 'sections', data: { name: 'Aayup Section', status: true } },
  { coll: 'religions', data: { name: 'Aayup Religion', status: true } },
  { coll: 'castes', data: { name: 'Aayup Caste', status: true } },
  { coll: 'subcastes', data: { casteName: 'Aayup Caste', subCasteName: 'Aayup Sub Caste', status: true } },
  { coll: 'categories', data: { name: 'Aayup Category', status: true } },
  { coll: 'parishes', data: { name: 'Aayup Parish', status: true } },
  { coll: 'houses', data: { name: 'Aayup House', status: true } },
  { coll: 'committees', data: { committeeName: 'Aayup Committee', committeeMember: 'Aayup Member', status: true } },
  { coll: 'clubs', data: { name: 'Aayup Club', status: true } },
  { coll: 'streams', data: { name: 'Aayup Stream', status: true } },
  { coll: 'optionalsubjects', data: { name: 'Aayup Subject', status: true } },
  { coll: 'parentsstatuses', data: { name: 'Aayup Parent Status', status: true } },
  { coll: 'studentclassifications', data: { name: 'Aayup Classification', status: true } },
  { coll: 'reasons', data: { name: 'Aayup Reason', status: true } },
  { coll: 'remarks', data: { name: 'Aayup Remark', status: true } },
  { coll: 'languages', data: { name: 'Aayup Language', status: true } },
  { coll: 'tccastes', data: { name: 'Aayup TC Caste', status: true } },
  { coll: 'extraactivities', data: { name: 'Aayup Activity', status: true } },
  { coll: 'characters', data: { name: 'Aayup Character', status: true } },
  { coll: 'promotionmasters', data: { name: 'Aayup Promotion', status: true } },
  { coll: 'lastresults', data: { name: 'Aayup Result', status: true } },
  { coll: 'termmasters', data: { name: 'Aayup Term', status: true } },
  { coll: 'morals', data: { name: 'Aayup Moral', status: true } },
  { coll: 'mothertongues', data: { name: 'Aayup Tongue', status: true } }
];

async function seed() {
  for (const item of collectionsAndData) {
    const Model = GenericModel(item.coll);
    try {
      // Check if it already exists
      let existing = null;
      if (item.data.name) {
        existing = await Model.findOne({ name: item.data.name });
      } else if (item.data.feeType) {
        existing = await Model.findOne({ feeType: item.data.feeType });
      } else if (item.data.committeeName) {
        existing = await Model.findOne({ committeeName: item.data.committeeName });
      }
      
      if (!existing) {
        await Model.create({ ...item.data, createdAt: new Date(), updatedAt: new Date(), sr: 1 });
        console.log(`Seeded ${item.coll} with Aayup test data.`);
      } else {
        console.log(`Skipped ${item.coll}, Aayup data already exists.`);
      }
    } catch (e) {
      console.error(`Error seeding ${item.coll}:`, e.message);
    }
  }
  mongoose.disconnect();
  console.log('Seeding completed!');
}

seed();
