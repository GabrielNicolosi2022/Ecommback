import config from '../config/config.js';
import { devLog, prodLog } from '../config/customLogger.js';
import users from '../models/schemas/UserModel.js';
import * as usersServices from '../services/dataBase/usersServices.js';
import { sendRecoverPassword } from '../utils/mail.utils.js';
import {
  isSamePassword,
  createHash,
  generateToken,
  validateToken,
} from '../utils/validations.utils.js';
import { userDTO } from '../DTO/currentUser.js';
import { createCart } from '../services/dataBase/cartServicesDB.js';

let log;
config.environment.env === 'production' ? (log = prodLog) : (log = devLog);

const root = (req, res) => {
  res.redirect('/login');
};
// Registro de usuario
const userRegister = async (req, res) => {
  if (req.get('User-Agent').includes('Postman')) {
    res.json({ message: 'Registro exitoso. Inicia sesión para continuar.' });
  } else {
    req.flash('success', 'Registro exitoso. Inicia sesión para continuar.');
    res.redirect('/login');
  }
};

// Login de usuario
// * no me deja hacer login como admin porque req.user.save is not a function, admin no tiene persistencia en db.
const userLogin = async (req, res) => {
  try {
    // Inicio de session por postman
    if (req.get('User-Agent').includes('Postman')) {
      // Generar el objeto 'user' en req.session
      req.session.user = {
        userId: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role,
      };
      // Verificar si el usuario ya tiene un carrito asignado
      if (!req.user.cart) {
        // Si no tiene un carrito asignado, crear uno nuevo y asociarlo al usuario
        const newCart = await createCart(req.user._id, { products: [] });

        // Asignar el ID del nuevo carrito al campo 'cart' del usuario
        req.user.cart = newCart._id;

        // Guardar los cambios en el usuario en la base de datos
        await req.user.save();
      }
      res.status(200).json({
        status: 'success',
        message: 'Inicio de sesión exitoso.',
        user: req.session.user,
        cart: req.user.cart,
      });
    }
    // Inicio de session por vistas
    else {
      if (!req.user) {
        log.warn('Correo electrónico o contraseña incorrectos.');
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

      // Verificar si el usuario ya tiene un carrito asignado
      if (!req.user.cart) {
        // Si no tiene un carrito asignado, crear uno nuevo y asociarlo al usuario
        const newCart = await createCart(req.user._id, { products: [] });

        // Asignar el ID del nuevo carrito al campo 'cart' del usuario
        req.user.cart = newCart._id;

        // Guardar los cambios en el usuario en la base de datos
        await req.user.save();
      }
      req.flash('success', 'Inicio de sesión exitoso.');
      res.redirect('/product');
    }
  } catch (err) {
    log.fatal(err.message);
    return res.status(500).json({
      message: 'Error al iniciar session',
      err: err.message,
    });
  }
};

// Traer todos los usuarios
const getUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const users = await usersServices.getAll();

    if (limit && !isNaN(limit) && limit > 0) {
      return users.slice(0, limit);
    }
    return res.json({
      status: 'success',
      message: 'Usuarios encontrados',
      data: users,
    });
  } catch (error) {
    log.fatal('Error al obtener los usuarios. ' + error.message);
    res
      .status(500)
      .json({ status: 'error', error: 'Error al obtener los usuarios' });
  }
};

// Traer un usuario por Id
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await usersServices.getUserById(userId);
    if (!user) {
      log.error('Usuario no encontrado');
      return res.status(404).json({
        status: 'error',
        message: 'Usuario no encontrado',
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Usuario encontrado',
      data: user,
    });
  } catch (error) {
    log.fatal('Error al obtener el usuario. ' + error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener el usuario',
    });
  }
};

const passwordRecover = async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(404).send('Correo no enviado');
  }
  try {
    const user = await usersServices.getUserByEmail(email);
    if (!user) {
      return res.status(404).send('Usuario no existente!');
    }

    const token = generateToken(email);
    sendRecoverPassword(email, token);
    res.status(200).send('Reset de contraseña enviada');
  } catch (error) {
    log.error('Error: ' + error.message);
    return res.status(500).send('Error interno');
  }
};

const recoverPassword = (req, res) => {
  const { token } = req.query;
  const { email } = req.body;
  try {
    const checkToken = validateToken(token);
    if (!checkToken) {
      log.error('Invalid token');
      return res.status(401).send('Acceso denegado!');
    }

    const newToken = generateToken(email);

    res.status(200).json({
      message: 'Enviar a la pagina para hacer reset la contraseña!',
      token: newToken,
    });
  } catch (error) {
    log.error('Error'+ error.message);
    res.status(500).send('Error interno');
  }
};

const resetPassword = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await usersServices.getUserByEmail(email);
    if (!user) {
      return res.status(404).send('Usuario inexistente!');
    }
    // Verificar si la nueva contraseña es igual a la contraseña actual
    const isSame = await isSamePassword(password, user.password);
    if (isSame) {
      return res.status(400).send('No puedes usar la misma contraseña actual!');
    }

    const hashedPassword = await createHash(password);
    await usersServices.updatePasswordByEmail(email, hashedPassword);
    console.log('Contraseña modificada correctamente');
    res.status(200).send('Contraseña modificada correctamente');
  } catch (error) {
    console.error('Error: ', error);
    res.status(500).send('Error interno');
  }
};

// Renderizar vista registro
const register = (req, res) => {
  res.render('register', {
    title: 'Registro de usuario',
    view: 'Crear usuario',
  });
};

// Renderizar vista fail registro
const failregister = async (req, res) => {
  log.error('Failed Strategy');
  res.render('register', {
    title: 'Registro de usuario',
    view: 'Crear usuario',
    message: 'El email ya se encuentra en uso',
  });
};

// Renderizar vista login
const login = (req, res) => {
  res.render('login', {
    title: 'Login de usuario',
    view: 'Login',
  });
};

// Renderizar vista faillogin
const faillogin = async (req, res) => {
  console.log('Failed Login');
  res.render('login', {
    title: 'Login de usuario',
    view: 'Login',
    message: 'Inicio de sesión incorrecto',
  });
};

// Renderizar vista perfil de usuario
const profile = (req, res) => {
  res.render('profile', {
    title: 'Profile de usuario',
    view: 'Perfil',
    userSession: req.session.user,
    isAdmin: req.session.user.role === 'admin', // Agregar una variable 'isAdmin' según el rol del usuario
  });
};

// Renderizar vista passwordrecover
const passwordRecoverView = (req, res) => {
  res.render('passRecovery1', {
    title: 'Recuperar Contraseña',
    view: 'Recuperar Contraseña',
  });
};

// Renderizar vista passwordrecover
const recoverPasswordView = (req, res) => {
  res.render('passRecovery2', {
    title: 'Recuperar Contraseña',
    view: 'Recuperar Contraseña',
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
  getUsers,
  getUserById,
  profile,
  currentUser,
  logout,
  passwordRecover,
  recoverPassword,
  resetPassword,
  passwordRecoverView,
  recoverPasswordView,
};
