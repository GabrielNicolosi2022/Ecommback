import Router from 'express';
import * as controllers from '../controllers/cart.controller.js';
import { checkRole, isPrivate } from '../middlewares/auth.js';

const cartsRouter = Router();

// Obtener todos los carritos
cartsRouter.get('/', checkRole('admin'), controllers.getCarts);

// Agregar un nuevo carrito
cartsRouter.post('/', isPrivate, controllers.createCart);

// Obtener un carrito por id
cartsRouter.get('/:cid', checkRole('admin'), controllers.getCartById);

// Actualizar el carrito con nuevos productos y/o cantidad de ejemplares de un producto en un carrito
cartsRouter.put('/:cid', checkRole('premium', 'user'), controllers.updateCart);
// Actualizar el carrito con nuevos productos y/o cantidad de ejemplares de un producto en un carrito (Opción para Vistas)
cartsRouter.post('/:cid', checkRole('premium', 'user'), controllers.updateCart);

// Eliminar un carrito
cartsRouter.delete('/:cid', checkRole('admin'), controllers.deleteCart);

// Obtener el carrito del usuario actual
cartsRouter.get(
  '/user/:uid',
  isPrivate,
  checkRole('user', 'premium'),
  controllers.getMyCart
);

// Eliminar un producto del carrito
cartsRouter.delete(
  '/:cid/products/:pid',
  checkRole('user', 'premium'),
  controllers.deleteProdOfCart
);
// Eliminar un producto del carrito (Opción para Vistas)
cartsRouter.post(
  '/:cid/products/:pid',
  checkRole('user', 'premium'),
  controllers.deleteProdOfCart
);

// Finalizar el proceso de compra del carrito
cartsRouter.post(
  '/:cid/purchase',
  checkRole('user', 'premium'),
  controllers.purchase
);

export default cartsRouter;
