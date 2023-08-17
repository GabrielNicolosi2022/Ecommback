import { Router } from 'express';
import passport from 'passport';
import {
  currentUser,
  getUsers,
  getUserById,
  logout,
  userLogin,
  userRegister,
  passwordRecover,
  recoverPassword,
  resetPassword,
} from '../controllers/user.controller.js';
import { isAuthorized, isPrivate } from '../middlewares/auth.js';
import { isUserOrTokenValid } from '../middlewares/user.middlewares.js';

const sessionsRouter = Router();

// Registrar un usuario
sessionsRouter.post(
  '/register',
  passport.authenticate('local-register', {
    failureRedirect: '/failregister',
    failureFlash: true,
    successFlash: true,
  }),
  userRegister
);

// Login de usuario mediante app
sessionsRouter.post(
  '/login',
  passport.authenticate('local-login', {
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true,
  }),
  userLogin
);

// Login de usuario mediante GitHub
sessionsRouter.get(
  '/github',
  passport.authenticate('githubpass', { scope: ['user:email'] }),
  async (req, res) => {}
);

sessionsRouter.get(
  '/githubcallback',
  passport.authenticate('githubpass', { failureRedirect: '/login' }),
  async (req, res) => {
    // agregar el usuario a la sesión
    req.session.user = req.user;
    res.redirect('/product');
  }
);

// Listar todos los usuarios
sessionsRouter.get('/users', getUsers)

// Enviar mail de reset de contraseña
sessionsRouter.post('/users/passwordrecover', passwordRecover); // donde me lleve el botón de reset contraseña

// Recibir token para reset de contraseña
sessionsRouter.post('/users/recoverpassword', recoverPassword); // donde voy a enviar a escribir la contraseña nueva

// buscar usuario por Id
sessionsRouter.get('/users/:id', getUserById)

// Perfil de usuario
sessionsRouter.get('/current',isPrivate, currentUser);

// Enviar nueva contraseña
sessionsRouter.post('/users/resetpassword', isUserOrTokenValid, resetPassword); // donde voy a hacer reset de la contraseña

// Cerrar sesión de usuario
sessionsRouter.get('/logout', logout);

export default sessionsRouter;
