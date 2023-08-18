import { Router } from 'express';
import {
  currentUser,
  getUsers,
  getUserById,
  passwordRecover,
  recoverPassword,
  resetPassword,
} from '../controllers/user.controller.js';
import { isAuthorized, isPrivate } from '../middlewares/auth.js';
import { isUserOrTokenValid } from '../middlewares/user.middlewares.js';


const userRouter = Router();
// Listar todos los usuarios
userRouter.get('/', getUsers)

// Enviar mail de reset de contraseña
userRouter.post('/passwordrecover', passwordRecover); // donde me lleve el botón de reset contraseña

// Recibir token para reset de contraseña
userRouter.post('/recoverpassword', recoverPassword); // donde voy a enviar a escribir la contraseña nueva

// buscar usuario por Id
userRouter.get('/:id', getUserById)

// Perfil de usuario
userRouter.get('/current',isPrivate, currentUser);

// Enviar nueva contraseña
userRouter.post('/resetpassword', isUserOrTokenValid, resetPassword); // donde voy a hacer reset de la contraseña

export default userRouter;