import 'dotenv/config';
import config from './config/config.js';
import express, { json, urlencoded } from 'express';
import __dirname from './utils.js';
import cors from 'cors';

import passport from 'passport';
import initializePassport from './config/passport.config.js';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { configSocket } from './config/socket.config.js';
import { engine } from 'express-handlebars';
import cookieParser from 'cookie-parser';
import flash from 'express-flash';

import indexRouter from './router/Index.routes.js';
import router from './router/carts.routes.js';

import morgan from 'morgan';
import { devLog, prodLog } from './config/customLogger.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import db from './config/dbConnection.js';
import { passSessionToViews } from './middlewares/sessions.middlewares.js';
// Logger
let log;
config.environment.env === 'production' ? (log = prodLog) : (log = devLog);

/* CONFIGURATIONS */
const app = express();
const PORT = config.server.port;
const MONGO_DB = config.db.cs;

// Express
app.use(json()); // Middleware para parsear JSON
app.use(urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(cors());

// Swagger
const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentación en Swagger de Ecomm-Back',
      description:
        'Documentación de e-commerce curso de Programación Backend en CoderHouse.',
    },
  },
  apis: [`${__dirname}/docs/**/*.yaml`],
};

const specs = swaggerJSDoc(swaggerOptions);

// Session whit MongoStore
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_DB,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 60 * 10,
    }),
    secret: config.session.secret,
    resave: false,
    saveUninitialized: true,
  })
);

// Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Middleware para pasar la sesión a las vistas
app.use(passSessionToViews);

// Flash
app.use(flash());

// Morgan
app.use(morgan('dev'));

// Server HTTP
const server = app.listen(PORT, (err) => {
  db;
  if (err) {
    log.fatal('Connection Error: ', err.message);
    return;
  }
  log.info(`Running on port ${PORT}, in ${config.environment.env} environment`);
});

configSocket(server);

// Handlebars
app.engine(
  '.hbs',
  engine({
    defaultLayout: 'main',
    layoutsDir: router.get(__dirname + '/views/layouts'),
    partialsDir: router.get(__dirname + '/views/partials'),
    extname: '.hbs',
  })
);
app.set('views', __dirname + '/views');
app.set('view engine', '.hbs');

// Rutas
app.use(indexRouter);
app.use('/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(specs));

export default app;
