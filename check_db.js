const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
  const EBook = require('./models/ebookModel');
  const count = await EBook.countDocuments();
  const allBooks = await EBook.find({});
  console.log('Total EBooks in DB:', count);
  console.log('EBooks:', JSON.stringify(allBooks, null, 2));
  process.exit(0);
})
.catch(err => {
  console.error('DB Error:', err);
  process.exit(1);
});
