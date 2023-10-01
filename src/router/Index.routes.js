import { Router } from 'express';
import viewsRouter from './views.routes.js';
import sessionsRouter from './sessions.routes.js';
import userRouter from './users.routes.js';
import productsRouter from './products.routes.js';
import cartsRouter from './carts.routes.js';
import loggerRouter from './logger.routes.js';
import paymentRouter from './payment.routes.js';

const indexRouter = Router();


indexRouter.use('/', viewsRouter);
indexRouter.use('/v1/api/sessions', sessionsRouter);
indexRouter.use('/v1/api/users', userRouter);
indexRouter.use('/v1/api/products', productsRouter);
indexRouter.use('/v1/api/carts', cartsRouter);
indexRouter.use('/v1/api/logger', loggerRouter);
indexRouter.use('/v1/api/payment', paymentRouter);

export default indexRouter;
