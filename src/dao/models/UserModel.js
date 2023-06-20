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
    enum: ['user'],
    default: 'user',
  },
});

const UserModel = mongoose.model(userCollection, userSchema);

export default UserModel;
