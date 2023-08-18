import UserModel from '../models/schemas/UserModel.js';
import config from '../config/config.js';

import { devLog, prodLog } from '../config/customLogger.js';

let log;

config.environment.env === 'production' ? (log = prodLog) : (log = devLog);

// Función para actualizar los permisos del usuario
const updateUserPermissions = async (userId, permissions) => {
  try {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { permissions: permissions } }
    );
    log.info('User permissions updated successfully');
  } catch (error) {
    log.error('Error updating user permissions:' + error);
  }
};

export { updateUserPermissions };
