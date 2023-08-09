import { Router } from 'express';
// File System
import productsRouterFs from '../router/fs/products.router.js';
import cartsRouterFs from '../router/fs/carts.router.js';
// Mongo Database
import viewsRouter from './views.routes.js';
import sessionsRouter from './sessions.routes.js';
import productsRouter from './products.routes.js';
import cartsRouter from './carts.routes.js';
import loggerRouter from './logger.routes.js';

const indexRouter = Router();

indexRouter.use('/', viewsRouter);
indexRouter.use('/api/sessions', sessionsRouter);
indexRouter.use('/api/products', productsRouter);
indexRouter.use('/api/carts', cartsRouter);
indexRouter.use('/api/logger', loggerRouter);

export default indexRouter;
