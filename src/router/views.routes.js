import { Router } from 'express';
import * as userControllers from '../controllers/viewsControllers/user.controller.js';
import * as prodControllers from '../controllers/viewsControllers/prod.controller.js';
import * as cartControllers from '../controllers/viewsControllers/cart.controller.js';
import { isPublic, isPrivate, isAuthorized } from '../middlewares/auth.js';

const viewsRouter = Router();

// Rutas
viewsRouter.get('/', isPublic, userControllers.root);

viewsRouter.get('/register', isPublic, userControllers.register);

viewsRouter.get('/failregister', isPublic, userControllers.failregister);

viewsRouter.get('/login', isPublic, userControllers.login);

viewsRouter.get('/faillogin', userControllers.faillogin);

viewsRouter.get('/profile', isPrivate, userControllers.profile);

viewsRouter.get('/product', isPrivate, prodControllers.products);

viewsRouter.get('/product/:pid', isPrivate, prodControllers.productsById);

viewsRouter.get('/cart', isPrivate, cartControllers.cart);

viewsRouter.get('/cart/:cid', isPrivate, cartControllers.cartById);

export default viewsRouter;
