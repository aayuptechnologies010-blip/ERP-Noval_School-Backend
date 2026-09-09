require('dotenv').config();
const mongoose = require('mongoose');

(async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB successfully.');

    const db = mongoose.connection.db;

    // 1. Direct Model Updates
    const Staff = require('./models/staffModel');
    const TDSDeductee = require('./models/tdsDeducteeModel');
    const PayScale = require('./models/payScaleModel');
    const PayScaleAmount = require('./models/payScaleAmountModel');
    const Fixation = require('./models/fixationModel');
    const HeadRemark = require('./models/headRemarkModel');

    // 1.1 Update Staff (Ayup Khan -> Ayup Tech)
    const staffRes = await Staff.updateMany(
      { $or: [{ userName: 'SF072' }, { firstName: /ayup/i, lastName: /khan/i }] },
      { 
        $set: { 
          firstName: 'Ayup',
          lastName: 'Tech',
          emailId: 'ayup.tech@schoolsoft.com'
        } 
      }
    );
    console.log('Updated Staff:', staffRes);

    // 1.2 Update TDS Deductee
    const tdsRes = await TDSDeductee.updateMany(
      { name: /ayup khan/i },
      { $set: { name: 'Ayup Tech' } }
    );
    console.log('Updated TDSDeductee:', tdsRes);

    // 1.3 Update PayScale
    const scaleRes = await PayScale.updateMany(
      { scale: /ayup khan/i },
      { $set: { scale: 'Ayup Tech Scale 9300-34800' } }
    );
    console.log('Updated PayScale:', scaleRes);

    // 1.4 Update PayScaleAmount
    const amountRes = await PayScaleAmount.updateMany(
      { scale: /ayup khan/i },
      { $set: { scale: 'Ayup Tech Scale 9300-34800' } }
    );
    console.log('Updated PayScaleAmount:', amountRes);

    // 1.5 Update Fixation
    const fixationRes = await Fixation.updateMany(
      { scale: /ayup khan/i },
      { $set: { scale: 'Ayup Tech Scale 9300-34800' } }
    );
    console.log('Updated Fixation:', fixationRes);

    // 1.6 Update HeadRemark
    const remarkRes = await HeadRemark.updateMany(
      { staffName: /ayup khan/i },
      { 
        $set: { 
          staffName: 'Ayup Tech',
          remark: 'Annual performance incentive addition for Ayup Tech'
        } 
      }
    );
    console.log('Updated HeadRemark:', remarkRes);

    // 2. Comprehensive deep scan across ALL collections in the database
    const collections = await db.collections();
    console.log(`\nScanning ${collections.length} database collections for any remaining 'Ayup Khan'...`);

    for (const col of collections) {
      const colName = col.collectionName;
      // Search all documents in the collection
      const docs = await col.find({}).toArray();
      let colUpdated = 0;

      for (const doc of docs) {
        let changed = false;
        const replaceString = (obj) => {
          for (const key of Object.keys(obj)) {
            if (typeof obj[key] === 'string' && /ayup\s+khan/i.test(obj[key])) {
              obj[key] = obj[key].replace(/ayup\s+khan/gi, 'Ayup Tech');
              changed = true;
            } else if (typeof obj[key] === 'object' && obj[key] !== null) {
              replaceString(obj[key]);
            }
          }
        };

        replaceString(doc);

        if (changed) {
          const docId = doc._id;
          delete doc._id;
          await col.updateOne({ _id: docId }, { $set: doc });
          colUpdated++;
        }
      }

      if (colUpdated > 0) {
        console.log(`✅ Collection [${colName}]: updated ${colUpdated} documents.`);
      }
    }

    console.log('\n🎉 ALL OCCURRENCES OF "Ayup Khan" HAVE BEEN SUCCESSFULLY REPLACED WITH "Ayup Tech" IN DATABASE!');
    process.exit(0);
  } catch (err) {
    console.error('Error updating to Ayup Tech:', err);
    process.exit(1);
  }
})();
