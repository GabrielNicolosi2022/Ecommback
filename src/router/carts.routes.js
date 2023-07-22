import Router from 'express';
import * as controllers from '../controllers/cart.controller.js';

const router = Router();

// Obtener todos los carritos
router.get('/', controllers.getCarts);

// Obtener un carrito por id
router.get('/:cid', controllers.getCartById);

// Agregar un nuevo carrito
router.post('/', controllers.createCart);

// Actualizar el carrito con nuevos productos
router.put('/:cid', controllers.updateCart);

// Actualizar cantidad de ejemplares de un producto en un carrito
router.put('/:cid/products/:pid', controllers.updateProdOfCart);

// Eliminar un producto del carrito
router.delete('/:cid/products/:pid', controllers.deleteProdOfCart);

// Eliminar un carrito
router.delete('/:cid', controllers.deleteCart);

export default router;
