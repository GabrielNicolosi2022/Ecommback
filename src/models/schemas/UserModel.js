import mongoose from 'mongoose';

const userCollection = 'User';

const documentsSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  reference: {
    type: String,
  },
});

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 1,
  },
  password: {
    type: String,
    required: false,
  },
  role: {
    type: String,
    enum: ['user', 'premium', 'admin'],
    default: 'user',
  },
  permissions: {
    type: Map,
    of: Boolean,
    default: { createProducts: false },
  },
  cart: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'carts',
  },
  orders: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
  },
  documents: [documentsSchema],
  last_connection: {
    type: Date,
    required: true,
    default: new Date(),
  },
  enabled: {
    type: Boolean,
    default: true,
  },
});

const users = mongoose.model(userCollection, userSchema);

export default users;
