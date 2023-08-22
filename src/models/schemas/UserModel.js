import mongoose from 'mongoose';

const userCollection = 'User';

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
});

const users = mongoose.model(userCollection, userSchema);

export default users;
