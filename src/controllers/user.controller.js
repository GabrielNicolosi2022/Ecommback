import users from '../models/schemas/UserModel.js';
import { userDTO } from '../DTO/currentUser.js';

const root = (req, res) => {
  res.redirect('/login');
};

const userRegister = async (req, res) => {
  if (req.get('User-Agent').includes('Postman')) {
    res.json({ message: 'Registro exitoso. Inicia sesión para continuar.' });
  } else {
    req.flash('success', 'Registro exitoso. Inicia sesión para continuar.');
    res.redirect('/login');
  }
};

const register = (req, res) => {
  res.render('register', {
    title: 'Registro de usuario',
    view: 'Crear usuario',
  });
};

const failregister = async (req, res) => {
  console.log('Failed Strategy');
  res.render('register', {
    title: 'Registro de usuario',
    view: 'Crear usuario',
    message: 'El email ya se encuentra en uso',
  });
};

const userLogin = async (req, res) => {
  if (req.get('User-Agent').includes('Postman')) {
    if (!req.user) {
      return res
        .status(400)
        .json({ error: 'Correo electrónico o contraseña incorrectos.' });
    }
    // Generar el objeto 'user' en req.session
    req.session.user = {
      first_name: req.user.first_name,
      last_name: req.user.last_name,
      age: req.user.age,
      email: req.user.email,
      role: req.user.role,
    };
    res.status(200).json({
      status: 'success',
      message: 'Inicio de sesión exitoso.',
      user: req.session.user,
    });
  } else {
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
    res.redirect('/product');
  }
};

const login = (req, res) => {
  res.render('login', {
    title: 'Login de usuario',
    view: 'Login',
  });
};

const faillogin = async (req, res) => {
  console.log('Failed Login');
  res.render('login', {
    title: 'Login de usuario',
    view: 'Login',
    message: 'Inicio de sesión incorrecto',
  });
};

const profile = (req, res) => {
  res.render('profile', {
    title: 'Profile de usuario',
    view: 'Perfil',
    userSession: req.session.user,
    isAdmin: req.session.user.role === 'admin', // Agregar una variable 'isAdmin' según el rol del usuario
  });
};

const currentUser = async (req, res) => {
  try {
    // Si el usuario es el administrador, responder directamente con el objeto del usuario administrador
    if (req.user && req.user.id === 'admin') {
      return res.json(req.user);
    }
    // Verificar si hay un usuario en la sesión actual
    if (req.session.user) {
      // Obtener el usuario actual
      const userSession = req.session.user;

      // Buscar el usuario en la base de datos utilizando el ID
      const user = await users.findOne(userSession);

      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Crear un DTO del usuario con la información necesaria
      const userDTOData = userDTO(user);

      // Devolver el usuario en la respuesta
      res.json(userDTOData);
    } else {
      // No hay un usuario en la sesión actual
      res.json(null);
    }
  } catch (error) {
    console.error('Error al buscar el usuario:', error);
    res.status(500).json({ error: 'Error al buscar el usuario' });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Error al destruir la sesión', err);
      return res.status(500).json({ error: 'Error al cerrar la sesión' });
    }
    res.redirect('/login');
  });
};

export {
  root,
  register,
  userRegister,
  failregister,
  login,
  userLogin,
  faillogin,
  profile,
  currentUser,
  logout
};
