import * as logic from '../../utils/cartLogic.js';
import CartManager from '../../services/dataBase/cartServicesDB.js';
const cartManager = new CartManager();

const getCarts = async (req, res) => {
  try {
    const carts = await logic.getCarts(req);
    return res.json({
      status: 'success',
      message: 'Carritos encontrados',
      data: carts,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getCartById = async (req, res) => {
  try {
    const _id = req.params.cid;
    const cart = await logic.getCartById(_id);

    res.json({
      status: 'success',
      message: 'Carrito encontrado',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createCart = async (req, res) => {
  try {
    const { products } = req.body;

    const nuevoCarrito = await logic.createCart(products);

    res.send({
      status: 'success',
      message: 'Nuevo carrito creado correctamente',
      data: nuevoCarrito,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateCart = async (req, res) => { // ! Revisar error
  try {
    const cartId = req.params.cid;
    const { products } = req.body;
    console.log('req.params.cid: ', req.params.cid,'req.body: ', req.body);

    const cart = await logic.updateCart(cartId, products);

    res
      .status(200)
      .json({
        status: 'success',
        message: 'Carrito actualizado correctamente',
        data: cart,
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateProdOfCart = async (req, res) => { // * Falta separar lógica
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = req.body.quantity;

    // traer el cart por id
    const cart = await cartManager.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // obtener el producto por id
    const productIndex = cart.products.findIndex(
      (p) => p._id.toString() === productId
    );

    if (productIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Producto no encontrado en el carrito' });
    }
    cart.products[productIndex].quantity = quantity;

    await cart.save();

    res
      .status(200)
      .json({ message: 'Cantidad de ejemplares actualizada', cart });
  } catch (error) {
    res.status(500).json({
      message: 'Error al actualizar la cantidad de ejemplares del producto',
      error,
    });
  }
};

const deleteProdOfCart = async (req, res) => { // * Falta separar lógica
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
};

const deleteCart = async (req, res) => { // * Falta separar lógica
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
};

export {
  getCarts,
  getCartById,
  createCart,
  updateCart,
  updateProdOfCart,
  deleteProdOfCart,
  deleteCart,
};
