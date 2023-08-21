import config from './config.js';
import { devLog, prodLog } from '../config/customLogger.js';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import gitHubStrategy from 'passport-github2';
import { createHash, isValidPassword } from '../utils/validations.utils.js';
import UserModel from '../models/schemas/UserModel.js';
import { updateUserPermissions } from '../utils/permissions.utils.js';

let log;
config.environment.env === 'production' ? (log = prodLog) : (log = devLog);

const initializePassport = () => {
  // Estrategia de registro local
  passport.use(
    'local-register',
    new LocalStrategy(
      { passReqToCallback: true, usernameField: 'email' },
      async (req, username, password, done) => {
        const { first_name, last_name, age, role, permissions } = req.body;

        // Verificar si todos los campos requeridos están presentes
        if (!first_name || !last_name || !username || !age || !password) { 
          log.error('All fields are required');
          return done(null, false, {
            message: 'All fields are required',
          });
        }

        try {
          const user = await UserModel.findOne({ email: username });
          // Si el user existe
          if (user) {
            log.error('User already exists');
            return done(null, false, { message: 'User already exists' });
          }
          // Si el user no existe
          const newUser = {
            first_name,
            last_name,
            email: username,
            age,
            password: createHash(password),
            role,
            permissions
          };
          const result = await UserModel.create(newUser);

          if (result.role === 'premium') {
            await updateUserPermissions(result._id, { createProducts: true });
          }

          log.info('New user created');
          return done(null, result, { message: 'User created' });
        } catch (error) {
          log.fatal('Error al obtener el usuario: ' + error.message);
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
          // verificar si es un usuario administrador
          if (
            email === config.admin.username &&
            password === config.admin.password
          ) {
            // Generar el objeto 'user' en req.session para el usuario administrador
            const userSession = {
              id: 'admin',
              first_name: 'Administrador',
              email: email,
              role: 'admin',
            };
            req.login(userSession, (err) => {
              if (err) {
                return done(err);
              }
              return done(null, userSession);
            });
          } else {
            const user = await UserModel.findOne({ email });

            if (!user) {
              log.error('Incorrect credentials');
              return done(null, false, {
                message: 'Incorrect credentials',
              });
            }
            const passwordMatch = isValidPassword(user, password); //isValidPassword está utilizando el compare de bcrypt
            log.info('passwordMatch: ' + passwordMatch);
            if (!passwordMatch) {
              log.error('Incorrect password');
              return done(null, false, { message: 'Incorrect password' });
            }
            log.info(`user ${user._id} successfully logged in`);
            return done(null, user);
          }
        } catch (error) {
          log.fatal('Error getting user:' + error);
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
        clientID: config.github.clientID,
        clientSecret: config.github.clientSecret,
        callbackURL: config.github.callbackURL,
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
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
      const adminUser = {
        id: 'admin',
        email: config.admin.username,
        role: 'admin',
      };
      return done(null, adminUser);
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
