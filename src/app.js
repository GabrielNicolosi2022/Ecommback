import express, { json, urlencoded } from 'express';
import __dirname from './utils.js';
import { engine } from 'express-handlebars';
import productsRouter from './router/products.routes.js';
import morgan from 'morgan';
import cartsRouter from './router/carts.routes.js';
import router from './router/carts.routes.js';
import viewsRouter from './router/views.routes.js'

/* CONFIGURATIONS */

// Express
const app = express();
app.use(json()); // Middleware para parsear JSON
app.use(urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));

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
  'handlebars',
  engine({
    defaultLayout: 'main',
    layoutsDir: router.get(__dirname / 'views/layouts'),
    partialsDir: router.get(__dirname / 'views/partials'),
    extname: '.handlebars',
  })
);
app.set('views', __dirname + '/views');
app.set('view engine', 'handlebars');

// file system
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);
// mongoDB
app.use('/', viewsRouter);
app.use('api/products', productsRouter);
app.use('api/carts', cartsRouter);

export default app;
