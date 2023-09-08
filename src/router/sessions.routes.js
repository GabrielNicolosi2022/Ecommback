import { Router } from 'express';
import passport from 'passport';
import {
  logout,
  userLogin,
  userRegister,
} from '../controllers/user.controller.js';
import { verifyRequiredFields } from '../middlewares/sessions.middlewares.js';
const sessionsRouter = Router();

// Registrar un usuario
sessionsRouter.post(
  '/register',
  verifyRequiredFields,
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

// Cerrar sesión de usuario
sessionsRouter.get('/logout', logout);

export default sessionsRouter;
