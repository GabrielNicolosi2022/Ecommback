import 'dotenv/config';
import config from './config/config.js';
import express, { json, urlencoded } from 'express';
import __dirname from './utils.js';
import {configSocket} from './config/socket.config.js';
import cors from 'cors';
import { engine } from 'express-handlebars';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'express-flash';
import MongoStore from 'connect-mongo';
import indexRouter from './router/Index.routes.js';
import router from './router/carts.routes.js';
import passport from 'passport';
import initializePassport from './config/passport.config.js';

/* CONFIGURATIONS */
const app = express();
const PORT = process.env.PORT || config.server.port;
const MONGO_DB = config.db.cs;

// Express
app.use(json()); // Middleware para parsear JSON
app.use(urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());
app.use(cors());

// Session whit MongoStore
app.use(
  session({
    store: MongoStore.create({
      mongoUrl: MONGO_DB,
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 300,
    }),
    secret: config.session.secret,
    resave: false,
    saveUninitialized: false,
  })
);

// Passport
initializePassport();
app.use(passport.initialize());
app.use(passport.session());

// Flash
app.use(flash());

// Morgan
app.use(morgan('dev'));

// Server HTTP
const server = app.listen(PORT, (err) => {
  if (err) {
    console.error('Connection Error: ', err);
    return;
  }
  console.log(`Running on port ${PORT}`);
});

configSocket(server) 

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

app.use(indexRouter);

export default app;
