import { Router } from 'express';
// File System
import productsRouterFs from '../router/fs/products.router.js';
import cartsRouterFs from '../router/fs/carts.router.js';
// Mongo Database
import viewsRouter from './views.routes.js';
import sessionsRouter from './sessions.routes.js';
import productsRouter from './products.routes.js';
import cartsRouter from './carts.routes.js';

const indexRouter = Router();

indexRouter.use('v1/', viewsRouter);
indexRouter.use('v1/api/sessions', sessionsRouter);
indexRouter.use('v1/api/products', productsRouter);
indexRouter.use('v1/api/carts', cartsRouter);

export default indexRouter;
