import mongoose from 'mongoose';
import config from './config.js';
import { devLog, prodLog } from '../config/customLogger.js';

let log;
config.environment.env === 'production' ? (log = prodLog) : (log = devLog);

const connection = mongoose
  .connect(config.db.cs, {
    dbName: config.db.dbName,
  })
  .catch((err) => log.fatal(err));

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Error to connect MongoDB:')); // no puedo customizar el log
db.once('open', () => {
  log.info('Connection successfully to mongoDB');
});

export default db;
