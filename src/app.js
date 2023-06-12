import express, { json, urlencoded } from 'express';
import __dirname from './utils.js';
import { engine } from 'express-handlebars';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import productsRouter from './router/products.routes.js';
import cartsRouter from './router/carts.routes.js';
import router from './router/carts.routes.js';
import sessionRouter from './router/sessions.routes.js'
import viewsRouter from './router/views.routes.js'

/* CONFIGURATIONS */

// Express
const app = express();
app.use(json()); // Middleware para parsear JSON
app.use(urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(cookieParser());

// Session con MongoStore
app.use(
  session({
    store: MongoStore.create({
      mongoUrl:
        'mongodb+srv://gabianp:PrIntMdb23@ecommerce.hwzuuds.mongodb.net/?retryWrites=true&w=majority',
      mongoOptions: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      ttl: 300,
    }),
    secret: '5ecretC0dE',
    resave: false,
    saveUninitialized: false,
  })
);

// Morgan
app.use(morgan('dev'));

// Server HTTP
const PORT = process.env.PORT || 8080;

const server = app.listen(PORT, (err) => {
  if (err) {
    console.log('Connection Error: ', err);
    return;
  }
  console.log(`Listen on port ${PORT}`);
});

// Handlebars
app.engine(
  '.hbs',
  engine({
    defaultLayout: 'main',
    layoutsDir: router.get(__dirname / 'views/layouts'),
    partialsDir: router.get(__dirname / 'views/partials'),
    extname: '.hbs',
  })
);
app.set('views', __dirname + '/views');
app.set('view engine', '.hbs');

// file system
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
// mongoDB
app.use('api/products', productsRouter);
app.use('api/carts', cartsRouter);
app.use('/api/sessions', sessionRouter);
app.use('/', viewsRouter);

export default app;
