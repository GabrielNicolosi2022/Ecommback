import { Router } from 'express';
import * as viewsControllers from '../dao/controllers/views.controllers.js';
import { isPublic, isPrivate, isAuthorized } from '../middlewares/auth.js';

const router = Router();

// Rutas
router.get('/', isPublic, viewsControllers.root);

router.get('/register', isPublic, viewsControllers.register);

router.get('/failregister', isPublic, viewsControllers.failregister);

router.get('/login', isPublic, viewsControllers.login);

router.get('/faillogin', viewsControllers.faillogin);

router.get('/profile', isPrivate, viewsControllers.profile);

router.get('/products', isPrivate, viewsControllers.products);

router.get('/product/:pid', isPrivate, viewsControllers.productsById);

router.get('/cart', isPrivate, viewsControllers.cart);

router.get('/cart/:cid', isPrivate, viewsControllers.cartById);

export default router;
