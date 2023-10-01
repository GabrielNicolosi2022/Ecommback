import UserModel from '../models/schemas/UserModel.js';
import getLogger from '../utils/log.utils.js';

const log = getLogger();

// Función para actualizar los permisos del usuario
const updateUserPermissions = async (userId, permissions) => {
  try {
    await UserModel.updateOne(
      { _id: userId },
      { $set: { permissions: permissions } }
    );
    log.info('User permissions updated successfully');
  } catch (error) {
    log.error('Error updating user permissions:' + error.message);
  }
};

export { updateUserPermissions };
