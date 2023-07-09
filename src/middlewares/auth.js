// Middleware para verificar si la ruta es pública
const isPublic = (req, res, next) => {
  if (req.session && req.session.user) {
    // Hay una sesión activa, redirigir al perfil
    res.redirect('/profile');
  } else {
    // No hay sesión activa, permitir el acceso
    next();
  }
};

// Middleware para verificar si la ruta es privada
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

export {
    isPublic,
    isPrivate,
    isAuthorized
}