import { generateUser } from './mocks/generateUsers.js';
import {
  getUserById,
  create,
  updateUserById,
} from '../services/dataBase/usersServices.js';
import getLogger from '../utils/log.utils.js';

const log = getLogger();

(async () => {
  log.info('Test DB - Create');
  const newUser = generateUser();
  const result = create(newUser);
  log.info(result);
})();
