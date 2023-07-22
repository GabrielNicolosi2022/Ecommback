import Router from 'express';

import CartManager from '../dao/fileSystem/cartManager.js';

const router = Router();
const cartManager = new CartManager();

// Obtener un carrito
router.get('/:cid', async (req, res) => {
  try {
    const cart = cartManager.carts.find((cart) => cart.id === req.params.cid);
    if (!cart) {
      res.status(404).json({ message: 'Carrito no encontrado' });
      return;
    }
    res.status(200).json({ message: 'Carrito encontrado', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrito', error });
  }
});

// Agregar un nuevo carrito
router.post('/', async (req, res) => {
  try {
    const newCart = await cartManager.addCart();
    console.log(newCart);
    res.status(201).json({ message: 'Carrito creado correctamente', newCart });
  } catch (error) {
    res.status(500).json({ message: 'Error al crear el carrito', error });
  }
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cart = cartManager.carts.find((cart) => cart.id === req.params.cid);
    if (!cart) {
      res.status(404).json({ message: 'Carrito no encontrado' });
      return;
    }
    const productId = req.params.pid;
    const product = { id: productId, quantity: 1 };
    const existingProductIndex = cart.products.findIndex(
      (product) => product.id === productId
    );
    if (existingProductIndex === -1) {
      cart.products.push(product);
    } else {
      cart.products[existingProductIndex].quantity++;
    }
    await cartManager.saveCarts();
    res.status(200).json({ message: 'Producto agregado correctamente', cart });
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar el producto', error });
  }
});

export default router;
