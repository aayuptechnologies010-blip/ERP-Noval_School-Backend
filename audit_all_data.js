const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

async function audit() {
  try {
    console.log('Connecting to Mongo...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected.');
    
    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    
    const results = await Promise.all(
      collections.map(async (col) => {
        try {
          const count = await db.collection(col.name).estimatedDocumentCount();
          return { name: col.name, count };
        } catch (e) {
          const count = await db.collection(col.name).countDocuments();
          return { name: col.name, count };
        }
      })
    );
    
    results.sort((a, b) => b.count - a.count);
    
    console.log('\n================ DATA AUDIT SUMMARY ================');
    const nonEmpty = results.filter(r => r.count > 0);
    const empty = results.filter(r => r.count === 0);
    
    console.log(`\n📌 COLLECTIONS WITH DATA (${nonEmpty.length} collections):`);
    nonEmpty.forEach(r => {
      console.log(`  • ${r.name.padEnd(35)} : ${r.count} records`);
    });
    
    console.log(`\n⚠️ EMPTY COLLECTIONS (${empty.length} collections):`);
    empty.forEach(r => {
      console.log(`  • ${r.name}`);
    });
    
    console.log('\n====================================================');
    process.exit(0);
  } catch (err) {
    console.error('Audit Error:', err);
    process.exit(1);
  }
}

audit();
