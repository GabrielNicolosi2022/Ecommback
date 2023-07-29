import users from '../models/schemas/UserModel.js';
import * as usersServices from '../services/dataBase/usersServices.js'
import { userDTO } from '../DTO/currentUser.js';
import { createCart } from '../services/dataBase/cartServicesDB.js';


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
    if (!req.user) {
      return res
        .status(400)
        .json({ error: 'Correo electrónico o contraseña incorrectos.' });
    }
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
      cart: req.user.cart
    });
  }
  // Inicio de session por vistas
  else {
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
    console.error(err);
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
    console.error(error);
    res
      .status(500)
      .json({ status: 'error', error: 'Error al obtener los carritos' });
  }
};

// Traer un usuario por Id
const getUserById = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await usersServices.getUserById(userId);
    if (!user) {
      // console.error(error);
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
    console.error(error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener el usuario',
    });
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
  console.log('Failed Strategy');
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
  logout
};
