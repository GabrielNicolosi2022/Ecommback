import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import gitHubStrategy from 'passport-github2';
import { createHash, isValidPassword } from '../utils.js';
import UserModel from '../dao/models/UserModel.js';

const initializePassport = () => {
  // Estrategia de registro local
  passport.use(
    'local-register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        // console.log(req.body);
        const { first_name, last_name, age } = req.body;

        // Verificar si todos los campos requeridos están presentes
        if (!first_name || !last_name || !username || !age || !password) {
          return done(null, false, {
            message: 'Todos los campos son requeridos',
          });
        }

        try {
          const user = await UserModel.findOne({ email: username });
          // Si el user existe
          if (user) {
            return done(null, false, { message: 'User already exists' });
          }
          // Si el user no existe
          const newUser = {
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
          };
          const result = await UserModel.create(newUser);
          return done(null, result, { message: 'User created' });
        } catch (error) {
          console.error('Error al obtener el usuario: ' + error);
          return done('Error al obtener el usuario: ' + error);
        }
      }
    )
  );

  // Estrategia de login local
  passport.use(
    'local-login',
    new LocalStrategy(
      { usernameField: 'email', passReqToCallback: true },
      async (req, email, password, done) => {
        try {
          // const { email, password } = req.body;
          console.log(email, password);
          // verificar si es un usuario administrador
          if (
            email === 'adminCoder@coder.com' &&
            password === 'adminCod3r123'
          ) {
            // Generar el objeto 'user' en req.session para el usuario administrador
            const userSession = {
              id: 'admin',
              email: email,
              role: 'admin',
            };
            console.log('userSession', userSession);
            req.login(userSession, (err) => {
              if (err) {
                return done(err);
              }
              return done(null, userSession);
            });
          } else {
            const user = await UserModel.findOne({ email });

            if (!user) {
              return done(null, false, {
                message: 'Correo electrónico incorrecto',
              });
            }

            const passwordMatch = isValidPassword(user, password); //isValidPassword está utilizando el compare de bcrypt
            console.log('passwordMatch: ', passwordMatch);

            if (!passwordMatch) {
              return done(null, false, { message: 'Contraseña incorrecta' });
            }

            return done(null, user);
          }
        } catch (error) {
          console.error('Error al obtener el usuario:' + error);
          return done(error);
        }
      }
    )
  );

  // Estrategia de login con Github
  passport.use(
    'githubpass',
    new gitHubStrategy(
      {
        clientID: 'Iv1.a3325d0fc13144e7',
        clientSecret: '7a9e605a79f4d59a7a324da98953b0a6ef1c10a6',
        callbackURL: 'http://localhost:8080/api/sessions/githubcallback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          console.log(profile);
          const user = await UserModel.findOne({ email: profile._json.email });
          //Si el usuario no existe en la base de datos, agregarlo.
          if (!user) {
            let name = profile._json.name;
            let nameArray = name.split(' ');

            const newUser = {
              first_name: nameArray[0],
              last_name: nameArray[1] || '',
              age: 1,
              email: profile._json.email,
              password: '',
            };
            // Autocompletar los campos faltantes
            // if (!newUser.last_name) {
            //   newUser.last_name = 'Predeterminado';
            // }
            if (!newUser.password) {
              newUser.password = '';
            }

            let result = await UserModel.create(newUser);
            done(null, result);
          } else {
            //Si el usuario ya existe
            done(null, user);
          }
        } catch (error) {
          return done(error);
        }
      }
    )
  );

// Serialización
  passport.serializeUser((user, done) => {
    // Si el usuario es el administrador, simplemente serializar el id "admin"
    if (user.id === 'admin') {
      return done(null, 'admin');
    }
    // Para otros usuarios, serializar su id de forma normal
    done(null, user.id);
  });

  // Deserialización
  passport.deserializeUser(async (id, done) => {
    // Si el id es "admin", devolver el objeto de usuario para el administrador
    if (id === 'admin') {
      const user = {
        id: 'admin',
        email: 'adminCoder@coder.com',
        role: 'admin',
      };
      return done(null, user);
    }
    // Para otros ids, buscar el usuario en la base de datos
    try {
      const user = await UserModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
};

export default initializePassport;
