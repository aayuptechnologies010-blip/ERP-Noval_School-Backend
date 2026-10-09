const mongoose = require('mongoose');
const uri = 'mongodb+srv://aayuptechnologies_db_user:t9a4mbgdpwlGUIzP@cluster0.xkwgx1b.mongodb.net/ERP-NovalSchool?appName=Cluster0';

mongoose.connect(uri).then(async () => {
  const cols = await mongoose.connection.db.listCollections().toArray();
  const relevant = cols.filter(c => 
    c.name.toLowerCase().includes('route') || 
    c.name.toLowerCase().includes('transport') || 
    c.name.toLowerCase().includes('vehic') ||
    c.name.toLowerCase().includes('stop')
  );
  console.log('Relevant collections:', relevant.map(c => c.name));

  for (const c of relevant) {
    const docs = await mongoose.connection.db.collection(c.name).find({}).toArray();
    console.log(`\n=== Collection: ${c.name} (${docs.length} docs) ===`);
    if (docs.length > 0) {
      console.log('First 3 docs:', docs.slice(0, 3));
    }
  }

  // Also inspect student transport details
  const studentsWithTransport = await mongoose.connection.db.collection('students').find(
    { 'transportDetails.isTransportStudent': true },
    { projection: { 'academicDetails.admissionNumber': 1, 'personalDetails.firstName': 1, transportDetails: 1 } }
  ).limit(5).toArray();
  console.log('\nSample students with transport:', JSON.stringify(studentsWithTransport, null, 2));

  process.exit(0);
}).catch(e => {
  console.error(e);
  process.exit(1);
});
