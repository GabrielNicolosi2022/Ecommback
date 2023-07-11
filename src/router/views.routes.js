import { Router } from 'express';
import * as userControllers from '../dao/controllers/views/user.controller.js';
import * as prodControllers from '../dao/controllers/views/prod.controller.js';
import * as cartControllers from '../dao/controllers/views/cart.controller.js';
import { isPublic, isPrivate, isAuthorized } from '../middlewares/auth.js';

const router = Router();

// Rutas
router.get('/', isPublic, userControllers.root);

router.get('/register', isPublic, userControllers.register);

router.get('/failregister', isPublic, userControllers.failregister);

router.get('/login', isPublic, userControllers.login);

router.get('/faillogin', userControllers.faillogin);

router.get('/profile', isPrivate, userControllers.profile);

router.get('/product', isPrivate, prodControllers.products);

router.get('/product/:pid', isPrivate, prodControllers.productsById);

router.get('/cart', isPrivate, cartControllers.cart);

router.get('/cart/:cid', isPrivate, cartControllers.cartById);

export default router;
