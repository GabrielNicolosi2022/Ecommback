import Router from 'express';
import * as controllers from '../controllers/cart.controller.js';
import { checkRole } from '../middlewares/auth.js';

const cartsRouter = Router();

// Obtener todos los carritos
cartsRouter.get('/', controllers.getCarts);

// Obtener un carrito por id
cartsRouter.get('/:cid', controllers.getCartById);

// Agregar un nuevo carrito
cartsRouter.post('/', controllers.createCart);

// Actualizar el carrito con nuevos productos
cartsRouter.put('/:cid', checkRole('user'), controllers.updateCart);

// Actualizar cantidad de ejemplares de un producto en un carrito
cartsRouter.put('/:cid/products/:pid', checkRole('user'), controllers.updateProdOfCart
);

// Eliminar un producto del carrito
cartsRouter.delete('/:cid/products/:pid', controllers.deleteProdOfCart);

// Eliminar un carrito
cartsRouter.delete('/:cid', controllers.deleteCart);

export default cartsRouter;
