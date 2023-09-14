import { Router } from 'express';
import * as userControllers from '../controllers/user.controller.js';
import * as prodControllers from '../controllers/prod.controller.js';
import * as cartControllers from '../controllers/cart.controller.js';
import { isPublic, isPrivate, checkRole } from '../middlewares/auth.js';
import { chat } from '../controllers/chat.controller.js';

const viewsRouter = Router();

// Rutas
viewsRouter.get('/', isPublic, userControllers.root);

viewsRouter.get('/chat', isPrivate, checkRole('user'), chat);

viewsRouter.get('/register', isPublic, userControllers.register);

viewsRouter.get('/failregister', isPublic, userControllers.failregister);

viewsRouter.get('/login', isPublic, userControllers.login);

viewsRouter.get('/faillogin', isPublic, userControllers.faillogin);

viewsRouter.get('/profile', isPrivate, userControllers.profile);

viewsRouter.get('/passwordrecover', userControllers.passwordRecoverView);

viewsRouter.get('/recoverpassword', userControllers.recoverPassword);

viewsRouter.get('/product', prodControllers.products);

viewsRouter.get('/product/:pid', prodControllers.productsById);

viewsRouter.get('/cart', isPrivate, cartControllers.viewCart);

viewsRouter.get('/cart/:cid', isPrivate, cartControllers.viewCartById);

viewsRouter.get(
  '/admin',
  checkRole('admin'),
  userControllers.adminControlPanel
);

export default viewsRouter;
