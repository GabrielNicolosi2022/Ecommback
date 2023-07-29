import { Router } from 'express';
import passport from 'passport';
import { currentUser, getUsers, getUserById, logout, userLogin, userRegister } from '../controllers/user.controller.js';
import { isAuthorized, isPrivate } from '../middlewares/auth.js';

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
sessionsRouter.get('/users',isAuthorized, getUsers)

// buscar usuario por Id
sessionsRouter.get('/users/:id', getUserById)

// Perfil de usuario
sessionsRouter.get('/current',isPrivate, currentUser);

// Cerrar sesión de usuario
sessionsRouter.get('/logout', logout);

export default sessionsRouter;
