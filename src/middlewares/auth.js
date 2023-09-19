import config from '../config/config.js';
import { devLog, prodLog } from '../config/customLogger.js';

let log;
config.environment.env === 'production' ? (log = prodLog) : (log = devLog);

// Middleware para verificar si la ruta es pública
const isPublic = (req, res, next) => {
  if (req.session && req.session.user) {
    // Hay una sesión activa, redirigir al listado de productos
    res.redirect('/product');
  } else {
    // No hay sesión activa, permitir el acceso
    next();
  }
};

// Middleware para verificar si la ruta es privada
/**
 * Debe estar logueado para tener acceso
 * @param {req.session.user} req 
 * @param {redirect} res 
 * @param {*} next 
 */
const isPrivate = (req, res, next) => {
  if (req.session && req.session.user) {
    // Hay una sesión activa, permitir el acceso
    next();
  } else {
    // No hay sesión activa, redirigir al login
    res.redirect('/login');
  }
};

// Middleware para verificar si el usuario tiene el rol 'admin' o 'user'
const isAuthorized = (req, res, next) => {
  if (req.session.user && req.session.user.role === 'admin') {
    // El usuario tiene el rol de administrador, permitir el acceso
    next();
  } else {
    // El usuario no tiene el rol adecuado, redirigir a una página de acceso denegado
    res.redirect('/access-denied');
  }
};

// Middleware para verificar el rol del usuario y autorizar el acceso a ciertas rutas
const checkRole =
  (...requiredRole) =>
  (req, res, next) => {
    // Verificar si hay una sesión activa y si el usuario tiene un rol válido
    if (
      req.session &&
      req.session.user &&
      // req.session.user.role === requiredRole
      requiredRole.includes(req.session.user.role)
    ) {
      // log.info('req.session: ', req.session)
      // El usuario tiene el rol adecuado, permitir el acceso
      next();
    } else {
      // El usuario no tiene el rol adecuado, devolver un mensaje de error o redirigir a una página de acceso denegado
      log.error('Acceso denegado. El usuario no tiene el rol adecuado');
      res.status(403).send('Acceso denegado');
    }
  };

export { isPublic, isPrivate, isAuthorized, checkRole };
