import { Router } from 'express';
import * as userControllers from '../controllers/user.controller.js';
import * as prodControllers from '../controllers/prod.controller.js';
import * as cartControllers from '../controllers/cart.controller.js';
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

router.get('/cart', isPrivate, cartControllers.viewCart);

router.get('/cart/:cid', isPrivate, cartControllers.viewCartById);

export default router;
