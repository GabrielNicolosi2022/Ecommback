import Router from 'express';

import CartManager from '../dao/controllers/cartManagerDB.js';

const router = Router();
const cartManager = new CartManager();

// Obtener todos los carritos
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const carts = await cartManager.getAllCarts();
    if (limit && !isNaN(limit) && limit > 0) {
      res.json(carts.slice(0, limit));
      return;
    }
    return res.json({ status: 'success', data: carts });
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los productos' });
  }
});

// Obtener un carrito por id
router.get('/:cid', async (req, res) => {
  try {
    const _id = req.params.cid;
    const cart = await cartManager.getCartById(_id);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    return res.json({
      status: 'success',
      message: 'Carrito encontrado',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error });
  }
});

// Agregar un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const { products } = req.body;

    if (!products) {
      res.status(400).json({ error: 'Faltan campos obligatorios' });
    }

    const nuevoCarrito = {
      products: products,
    };

    await cartManager.createCart(nuevoCarrito);

    res.send({
      status: 'success',
      message: 'Nuevo carrito creado correctamente',
      data: nuevoCarrito,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el carrito', error });

    console.log('El error es: ', error);
  }
});

// Agregar un producto a un carrito
router.put('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const product = {
      _id: productId,
      quantity: 1,
    };

    const existingProductIndex = cart.products.findIndex(
      (p) => p._id.toString() === productId
    );

    if (existingProductIndex === -1) {
      cart.products.push(product);
    } else {
      cart.products[existingProductIndex].quantity++;
    }

    await cart.save();

    res.status(200).json({ message: 'Producto agregado correctamente', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto', error });
  }
});

// Eliminar un producto de un carrito
router.delete('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;

    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    const existingProductIndex = cart.products.findIndex(
      (p) => p._id.toString() === productId
    );

    if (existingProductIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Producto no encontrado en el carrito' });
    }

    cart.products.splice(existingProductIndex, 1);

    await cart.save();

    res.status(200).json({ message: 'Producto removido correctamente', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error al remover el producto', error });
  }
});

// Eliminar un carrito
router.delete('/:cid', async (req, res) => {
  try {
    const _id = req.params.cid;
    const cart = await cartManager.getCartById(_id);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    await cartManager.deleteCart(cart);
    return res.json({
      status: 'success',
      message: 'Carrito eliminado correctamente',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error });
  }
});

export default router;
