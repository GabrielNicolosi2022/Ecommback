import mongoose from 'mongoose';

const userCollection = 'User';

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
    min: 1,
  },
  password: {
    type: String,
    required: true,
  },
});

const UserModel = mongoose.model(userCollection, userSchema);

export default UserModel;
