import UserModel from '../models/schemas/UserModel.js';
import { createHash } from '../utils/validations.utils.js';
import getLogger from '../utils/log.utils.js';

const log = getLogger();

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

    if (newUser.role === 'premium') {
      result.permissions.set('createProducts', true);
    }

    return result;
  } catch (error) {
    log.error('Error creating user:', error);
    throw error;
  }
};
