import mongoose from 'mongoose';
import config from './config.js';

// console.log(config.db.mongodb);
const connection = mongoose
  .connect(config.db.mongodb, {
    dbName: 'ecommerce',
  })
  .catch((err) => console.log(err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error to connect MongoDB:'));
db.once('open', () => {
  console.log('Connection succesfully to mongoDB');
});

export default db;
