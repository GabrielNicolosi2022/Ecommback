import mongoose from 'mongoose';
import config from './config.js';

// console.log(config.db.mongodb);
 const connection = mongoose
  .connect(config.db.cs, {
    dbName: 'ecommerce',
  })
  .catch((err) => console.log(err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error to connect MongoDB:'));
db.once('open', () => {
  console.log('Connection successfully to mongoDB');
});

export default db;
/*
export default class MongoSingleton {
  static #instance;

  constructor() {
    mongoose.connect(config.db.mongodb);
  }

  static getInstance() {
    if (this.#instance) {
      console.log('Already connected to MongoDB');
      return this.#instance;
    }

    this.#instance = new MongoSingleton();
    console.log('Connected to MongoDB');
    return this.#instance;
  }
}
 */