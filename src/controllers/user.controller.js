import config from '../config/config.js';
import { devLog, prodLog } from '../config/customLogger.js';
import * as usersServices from '../services/dataBase/usersServices.js';
import { sendRecoverPassword, deleteAccountMail } from '../utils/mail.utils.js';
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
  res.redirect('/product');
};
// Registro de usuario
const userRegister = async (req, res) => {
  /*   if (req.get('User-Agent').includes('Postman')) {
    res.status(201).json({
      status: 'success',
      message: 'Registro exitoso. Inicia sesión para continuar.',
    });
  } else {
    req.flash('success', 'Registro exitoso. Inicia sesión para continuar.');
    res.redirect('/login');
  }
 */
  try {
    const userCreated = req.user;

    res.status(201).json({
      status: 'success',
      message: 'Registro exitoso. Inicia sesión para continuar.',
      user: userCreated,
    });
  } catch (error) {
    log.error('Error creating user: ' + error);
    res.status(500).send({ error: 'Error interno' });
  }
};

// Login de usuario
const userLogin = async (req, res) => {
  try {
    // Inicio de session por postman
    if (req.get('User-Agent') && req.get('User-Agent').includes('Postman')) {
      // Generar el objeto 'user' en req.session
      req.session.user = {
        userId: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role,
        documents: req.user.documents,
        last_connection: new Date(),
      };

      // Verificar si el usuario no es el administrador
      if (req.user.role !== 'admin') {
        if (!req.user.cart) {
          // Verificar si el usuario ya tiene un carrito asignado
          // Si no tiene un carrito asignado, crear uno nuevo y asociarlo al usuario
          const newCart = await createCart(req.user._id, { products: [] });

          // Asignar el ID del nuevo carrito al campo 'cart' del usuario
          req.user.cart = newCart._id;

          // Guardar los cambios en el usuario en la base de datos
          await req.user.save();
        }
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
        userId: req.user._id,
        first_name: req.user.first_name,
        last_name: req.user.last_name,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role,
      };

      if (req.user.role !== 'admin') {
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
        return res.redirect('/product');
      }
      req.flash('success', 'Inicio de sesión exitoso.');
      res.redirect('/admin');
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

    // Crear un DTO del usuario con la información necesaria
    const usersDTOList = users.map(userDTO);

    if (limit && !isNaN(limit) && limit > 0) {
      return usersDTOList.slice(0, limit);
    }

    return res.json({
      status: 'success',
      message: 'Usuarios encontrados',
      data: usersDTOList,
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
    const uid = req.params.uid;
    const user = await usersServices.getUserById(uid);
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

// Modificar contraseña actual
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
    return res.status(500).send('Internal Server Error');
  }
};

const recoverPassword = (req, res) => {
  const { token } = req.query;
  // log.info('token: ' + token);
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
    log.error('Error' + error.message);
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

// Cambiar el rol de un usuario
const changeRole = async (req, res) => {
  try {
    const uid = req.params.uid;
    // Si es una solicitud HTTP
    if (req.get('User-Agent') && req.get('User-Agent').includes('Postman')) {
      const user = await usersServices.getUserById(uid);
      if (!user) {
        log.error(`Usuario con id ${_id} no encontrado`);
        return res.status(404).send('Usuario inexistente');
      }
      const newRole = req.body;
      if (!newRole || (newRole.role !== 'user' && newRole.role !== 'premium')) {
        log.error('El campo "role" se encuentra incompleto o es inválido');
        return res.status(400).send('Mala Petición');
      }

      const updatedRoleUser = await usersServices.updateUserById(uid, newRole);
      log.info(
        `El usuario con id: ${user._id} ahora tiene rol '${newRole.role}'`
      );
      res.status(200).json({
        status: 'success',
        message: 'Rol de usuario actualizado',
        data: updatedRoleUser,
      });
    } else {
      // Si es una solicitud desde la interfaz de usuario (vista)
      const user = await usersServices.getUserById(uid);
      if (!user) {
        log.error(`Usuario con id ${_id} no encontrado`);
        req.flash('error', 'Usuario inexistente');
        return res.redirect('/admin');
      }
      const newRole = req.body;
      if (!newRole || (newRole.role !== 'user' && newRole.role !== 'premium')) {
        log.error('El campo "role" se encuentra incompleto o es inválido');
        req.flash(
          'error',
          'Mala petición. El campo "Nuevo Rol" se encuentra incompleto o es inválido'
        );

        return res.redirect('/admin');
      }

      const updatedRoleUser = await usersServices.updateUserById(uid, newRole);
      log.info(
        `El usuario con id: ${user._id} ahora tiene rol '${newRole.role}'`
      );
      // Si es una petición de la interfaz de usuario (vista), redirigir a la página deseada
      req.flash('success', 'Rol de usuario actualizado con éxito');
      res.redirect('/admin');
    }
  } catch (error) {
    log.fatal('Error al obtener el usuario. ' + error.message);
    return res.status(500).send('Error interno');
  }
};

// Subir documentación
const uploadDocs = async (req, res) => {
  try {
    const uid = req.params.uid;

    const user = await usersServices.getUserById(uid);
    if (!user) {
      log.error(`Usuario con id ${_id} no encontrado`);
      return res.status(404).send('Usuario inexistente');
    }

    // Verificar si se han cargado documentos
    if (!req.files || req.files.length === 0) {
      log.error('No se han cargado archivos');
      return res.status(400).send('Mala Petición');
    }

    // Verificar si el usuario ya tiene 3 documentos cargados
    if (user.documents.length === 3) {
      log.error(
        'El usuario ya tiene 3 documentos cargados, no se pueden agregar más.'
      );
      return res.status(400).send('Límite de documentos alcanzado');
    }

    // Obtener los nombres de los archivos subidos
    const uploadedFileNames = req.files.map((file) =>
      file.originalname.replace(/\.[^/.]+$/, '')
    );

    // verificar si el nombre del archivo se encuentra en la lista permitida
    const allowedFileNames = [
      'identificacion',
      'comprobanteDomicilio',
      'comprobanteEstadoCuenta',
    ];
    const isValidFiles = uploadedFileNames.every((filename) =>
      allowedFileNames.includes(filename)
    );
    if (!isValidFiles) {
      log.error('Los archivos cargados son incorrectos');
      return res.status(400).send('Mala Petición');
    }

    // Procesar los archivos cargados
    const uploadedFiles = req.files;

    const newDocuments = [];
    // Iterar sobre los archivos cargados y agregar la información necesaria
    uploadedFiles.forEach((file) => {
      newDocuments.push({
        name: file.originalname,
        reference: `/public/images/documents/${file.filename}`,
      });
    });

    // Actualizar el estado del usuario con la información de los archivos cargados
    user.documents.push(...newDocuments);

    // Guardar los cambios en el usuario en la base de datos
    await user.save();

    const uploadedDocsInfo = newDocuments.map((doc) => {
      return doc.name;
    });
    log.info(
      `El usuario con id: ${
        user._id
      } ha subido documentación: ${uploadedDocsInfo.join(', ')}`
    );

    if (req.get('User-Agent') && req.get('User-Agent').includes('Postman')) {
      res.status(200).json({
        status: 'success',
        message: 'documentación de usuario actualizada',
        documents: user.documents,
      });
    } else {
      // Si es una petición de la interfaz de usuario (vista), redirigir a la página deseada
      req.flash('success', 'Documentación de usuario actualizada con éxito');
      res.render('profile');
    }
  } catch (error) {
    log.fatal('Error uploading documents: ' + error.message);
    return res.status(500).send('Error interno del servidor');
  }
};

const deleteUsers = async (req, res) => {
  try {
    const currentDate = new Date();
    const twoDaysAgo = new Date(currentDate);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    const usersList = await usersServices.getAll();
    // verificar que solo sean con rol 'user'
    const onlyUserRole = usersList.filter((user) => user.role === 'user');
    log.info('onlyUserRole: ' + onlyUserRole);

    const usersToClean = onlyUserRole.filter((user) => {
      return user.last_connection <= twoDaysAgo;
    });
    const usersIdsToDelete = usersToClean.map((user) => user._id);
    const emailsToDelete = usersToClean.map((user) => user.email);

    if (usersIdsToDelete.length === 0) {
      return res.status(404).send('No users to delete');
    }

    if (usersIdsToDelete.length > 0) {
      const deleteResult = await usersServices.deleteUsersById(
        usersIdsToDelete
      );
      //  Enviar correos a usuarios eliminados
      deleteAccountMail(emailsToDelete);
    }

    if (req.get('User-Agent') && req.get('User-Agent').includes('Postman')) {
      res.status(200).json({
        status: 'success',
        message: `${usersToClean.length} Users successfully removed due to inactivity`,
        data: usersToClean,
      });
    } else {
      // Si es una petición de la interfaz de usuario (vista), redirigir a la página deseada
      req.flash(
        'success',
        `${usersToClean.length} Usuarios eliminados exitosamente debido a inactividad`
      );
      res.redirect('/admin');
    }
  } catch (error) {
    log.fatal('cleanUsers: ' + error.message);
    res.status(500).send('Internal Server Error');
  }
};

// ------------------------ VIEWS ------------------------------
const adminControlPanel = async (req, res) => {
  try {
    const users = await usersServices.getAll();

    res.render('adminControlPanel', {
      title: 'EcommBack - ACP',
      view: 'Panel de control de admin',
      users,
    });
  } catch (error) {
    log.fatal('adminControlPanel: ' + error.message);
    res
      .status(500)
      .json({ status: 'error', error: 'Error interno de servidor' });
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
  log.info('Failed Login');
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
      const user = await usersServices.getUserById(userSession.userId);
      if (!user) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }

      // Crear un DTO del usuario con la información necesaria
      const userDTOData = userDTO(user);

      // Devolver el usuario en la respuesta
      res.json({data: userDTOData});
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
  changeRole,
  uploadDocs,
  deleteUsers,
  adminControlPanel,
};
