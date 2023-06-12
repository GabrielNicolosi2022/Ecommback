import { Router } from 'express';
import UserModel from '../dao/models/UserModel.js';

const router = Router();
// Registrar un usuario
router.post('/register', async (req, res) => {
  try {
    console.log('req.body: ', req.body);
    const { first_name, last_name, email, age, password } = req.body;

    // Crear un nuevo usuario en la base de datos
    const newUser = new UserModel({
      firstname: first_name,
      lastname: last_name,
      email,
      age,
      password,
      role: 'user',
    });
    await newUser.save();

    res.redirect('/login');
  } catch (error) {
    console.error('Error al registrar el usuario', error);
    res.status(500).json({ error: 'Error al registrar el usuario' });
  }
});

// Login de usuario
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // verificar si es un usuario administrador
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
      // Generar el objeto 'user' en req.session para el usuario administrador
      const userSession = {
        email: email,
        role: 'admin',
      };

      req.session.user = userSession;

      // Rendireccionar a la vista de productos
      return res.redirect('/products');
    }

    //  Buscar al usuario en la base de datos
    const foundUser = await UserModel.findOne({ email });

    // Verificar si el usuario existe y la contraseña es correcta
    if (!foundUser || foundUser.password !== password) {
      return res.redirect('/login');
    }

    // Generar el objeto 'user' en req.session
    const userSession = {
      id: foundUser._id,
      firstname: foundUser.firstname,
      lastname: foundUser.lastname,
      email: foundUser.email,
      age: foundUser.age,
      role: 'user',
    };

    req.session.user = userSession;

    // Rendireccionar a la vista de productos
    res.redirect('/products');
  } catch (error) {
    console.error('Error al iniciar sesión', error);
    return res.status(500).json({ error: 'Error al iniciar sesión' });
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
