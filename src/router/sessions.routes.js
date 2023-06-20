import { Router } from 'express';
import passport from 'passport';
import UserModel from '../dao/models/UserModel.js';
import { createHash, isValidPassword } from '../utils.js';

const router = Router();
// Registrar un usuario
router.post(
  '/register',
  passport.authenticate('local-register', {
    // successRedirect:'/login',
    failureRedirect: '/failregister',
    failureFlash: true,
    successFlash: true,
  }),
  async (req, res) => {
    /* INSERTAR UN ALERTA ANTES DE PASAR AL LOGIN */
    req.flash('success', 'Registro exitoso. Inicia sesión para continuar.');
    res.render('login');
  }
);

// Login de usuario mediante app
router.post(
  '/login',
  passport.authenticate('local-login', {
    failureRedirect: '/login',
    failureFlash: true,
    successFlash: true,
  }),
  async (req, res) => {
    if (!req.user) {
      req.flash('failure', 'Correo electrónico o contraseña incorrectos.');
      return res.render('login', { failureFlash: true });
    }
    // Generar el objeto 'user' en req.session
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
    };
    req.flash('success', 'Inicio de sesión exitoso.');
    res.redirect('/products');
  }
);

// Login de usuario mediante GitHub
router.get(
  '/github',
  passport.authenticate('githubpass', { scope: ['user:email'] }),
  async (req, res) => {}
);

router.get(
  '/githubcallback',
  passport.authenticate('githubpass', { failureRedirect: '/login' }),
  async (req, res) => {
    // agregar el usuario a la sesión
    req.session.user = req.user;
    res.redirect('/products');
  }
);

// Cerrar sesión de usuario
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al destruir la sesión', err);
      return res.status(500).json({ error: 'Error al cerrar la sesión' });
    }
    res.redirect('/login');
  });
});

export default router;
