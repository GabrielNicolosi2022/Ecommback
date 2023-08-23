import Router from 'express';
import * as controllers from '../controllers/cart.controller.js';
import { checkRole, isPrivate } from '../middlewares/auth.js';

const cartsRouter = Router();

// Obtener todos los carritos
cartsRouter.get('/', checkRole('admin'), controllers.getCarts);

// Obtener un carrito por id
cartsRouter.get('/:cid', checkRole('admin'), controllers.getCartById);

// Obtener el carrito del usuario actual
cartsRouter.get(
  '/user/:uid',
  isPrivate,
  checkRole('user'),
  controllers.getMyCart
);

// Agregar un nuevo carrito
cartsRouter.post('/', isPrivate, controllers.createCart);

// Actualizar el carrito con nuevos productos y/o cantidad de ejemplares de un producto en un carrito
cartsRouter.put('/:cid', checkRole('premium', 'user'), controllers.updateCart);
// cartsRouter.put('/:cid', checkRole('user'), controllers.updateCart);

// Eliminar un producto del carrito
cartsRouter.delete(
  '/:cid/products/:pid',
  checkRole('user'),
  controllers.deleteProdOfCart
);

// Finalizar el proceso de compra del carrito
cartsRouter.post('/:cid/purchase', checkRole('user'), controllers.purchase);

// Eliminar un carrito
cartsRouter.delete('/:cid', checkRole('admin'), controllers.deleteCart);

export default cartsRouter;
