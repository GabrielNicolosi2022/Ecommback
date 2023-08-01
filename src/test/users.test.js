import { generateUser } from './mocks/generateUsers.js';
import {
  getUserById,
  create,
  updateUserById,
} from '../services/dataBase/usersServices.js';

(async () => {
  console.log('Test DB - Create');
  const newUser = generateUser();
  const result = create(newUser);
  console.log(result);
})();
