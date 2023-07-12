const root = (req, res) => {
  res.redirect('/login');
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


export { root, register, failregister, login, faillogin, profile};
