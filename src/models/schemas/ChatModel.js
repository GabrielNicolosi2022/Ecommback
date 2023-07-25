import mongoose from 'mongoose';

import db from '../../config/dbConnection.js';

const chatCollection = 'chats';

const chatSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  message: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
});

const chatModel = db.model(chatCollection, chatSchema);
export default chatModel;
