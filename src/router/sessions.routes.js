import { Router } from 'express';
import passport from 'passport';
import UserModel from '../dao/models/UserModel.js';
import { createHash, isValidPassword } from '../utils.js';

const router = Router();
// Registrar un usuario
router.post(
  '/register',
  passport.authenticate('local-register', {
    failureRedirect: '/failregister',
    failureFlash: true,
    successFlash: true,
  }),
  async (req, res) => {
    /* INSERTAR UN ALERTA ANTES DE PASAR AL LOGIN */
    req.flash('success', 'Registro exitoso. Inicia sesión para continuar.');
    res.redirect('/login');
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
      role: req.user.role,
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

// Perfil de usuario
router.get('/current', async (req, res) => {
  try {
    // Verificar si hay un usuario en la sesión actual
    if (req.session.user) {
      // Obtener el usuario actual
      const userSession = req.session.user;

      // Buscar el usuario en la base de datos utilizando el ID
      const user = await UserModel.findOne(userSession);

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Devolver el usuario en la respuesta
      res.json(user);
    } else {
      // No hay un usuario en la sesión actual
      res.json(null);
    }
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    res.status(500).json({ error: 'Error al buscar el usuario' });
  }
});

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
