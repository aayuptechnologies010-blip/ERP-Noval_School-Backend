const mongoose = require('mongoose');
const uri = 'mongodb+srv://aayuptechnologies_db_user:t9a4mbgdpwlGUIzP@cluster0.xkwgx1b.mongodb.net/ERP-NovalSchool?appName=Cluster0';

async function updateSections() {
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const ClassSection = mongoose.connection.db.collection('classsections');
  const allDocs = await ClassSection.find({}).toArray();
  
  let updatedCount = 0;
  for (const doc of allDocs) {
    let secs = Array.isArray(doc.sections) ? [...doc.sections] : [];
    let changed = false;
    if (!secs.includes('A')) { secs.push('A'); changed = true; }
    if (!secs.includes('B')) { secs.push('B'); changed = true; }
    secs = Array.from(new Set(secs)).sort();
    if (changed || secs.length !== (doc.sections || []).length) {
      await ClassSection.updateOne({ _id: doc._id }, { $set: { sections: secs } });
      console.log(`Updated class ${doc.className} to sections:`, secs);
      updatedCount++;
    }
  }

  // Also check if any schoolclasses are missing in classsections
  const schoolClasses = await mongoose.connection.db.collection('schoolclasses').find({}).toArray();
  for (const sc of schoolClasses) {
    const cName = sc.className;
    if (cName && !allDocs.some(d => (d.className || '').toLowerCase() === cName.toLowerCase())) {
      await ClassSection.insertOne({
        className: cName,
        sections: ['A', 'B'],
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`Inserted missing class ${cName} with ['A', 'B'] into classsections`);
      updatedCount++;
    }
  }

  // Ensure sections 'A' and 'B' are defined in 'sections' collection as well
  const sectionsCol = mongoose.connection.db.collection('sections');
  const existingSecs = await sectionsCol.find({}).toArray();
  const existingNames = existingSecs.map(s => (s.sectionName || s.name || '').toUpperCase());

  if (!existingNames.includes('A')) {
    await sectionsCol.insertOne({ sectionName: 'A', orderNo: 1, isActive: true, createdAt: new Date(), updatedAt: new Date() });
    console.log('Added Section A to sections collection');
  }
  if (!existingNames.includes('B')) {
    await sectionsCol.insertOne({ sectionName: 'B', orderNo: 2, isActive: true, createdAt: new Date(), updatedAt: new Date() });
    console.log('Added Section B to sections collection');
  }

  const finalDocs = await ClassSection.find({}).toArray();
  console.log('FINAL CLASS_SECTIONS:');
  console.log(finalDocs.map(d => `${d.className}: [${d.sections.join(', ')}]`).join('\n'));

  console.log(`Done! Total classes updated: ${updatedCount}`);
  await mongoose.disconnect();
}

updateSections().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
