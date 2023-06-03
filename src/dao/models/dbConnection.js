import mongoose from 'mongoose';

const connection = mongoose
  .connect(
    `mongodb+srv://gabianp:PrIntMdb23@ecommerce.hwzuuds.mongodb.net/?retryWrites=true&w=majority`,
    {
      dbName: 'ecommerce',
    }
  )
  .catch((err) => console.log(err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error to connect MongoDB:'));
db.once('open', () => {
  console.log('Connection succesfully to mongoDB');
});

export default db;