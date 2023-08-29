import UserModel from '../models/schemas/UserModel.js';
import { createHash } from '../utils/validations.utils.js';
import { updateUserPermissions } from '../utils/permissions.utils.js';

export const createUser = async ({
  first_name,
  last_name,
  email,
  age,
  password,
  role,
}) => {
  try {
    const newUser = {
      first_name,
      last_name,
      email,
      age,
      password: createHash(password),
      role,
    };

    const result = await UserModel.create(newUser);
    if (role === 'premium') {
      await updateUserPermissions(result._id, { createProducts: true });
    }

    return result;
  } catch (error) {
    console.error('Error creating user:', error);
    throw error;
  }
};
