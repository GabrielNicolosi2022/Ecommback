// import * as logic from '../../utils/cartLogic.js';
import CartServices from '../../services/dataBase/cartServicesDB.js';
const cartServices = new CartServices();

const getCarts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit);
    const carts = await cartServices.getAllCarts();

    if (limit && !isNaN(limit) && limit > 0) {
      return carts.slice(0, limit);
    }
    return res.json({
      status: 'success',
      message: 'Carritos encontrados',
      data: carts,
    });
  } catch (error) {
    res
      .status(500)
      .json({ status: 'error', error: 'Error al obtener los carritos' });
  }
};

const getCartById = async (req, res) => {
  try {
    const _id = req.params.cid;
    const cart = await cartServices.getCartById(_id);

    if (!cart) {
      return res.status(404).json({
        status: 'error',
        message: 'Carrito no encontrado',
      });
    }
    res.status(200).json({
      status: 'success',
      message: 'Carrito encontrado',
      data: cart,
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener el carrito',
    });
  }
};

const createCart = async (req, res) => {
  try {
    const { products } = req.body;
    console.log({ products });
    if (!products) {
      return res.status(400).json({
        status: 'error',
        message: 'No se han enviado productos para cargar en el carrito',
      });
    }
    const nuevoCarrito = {
      products: products,
    };
    console.log(nuevoCarrito);
    await cartServices.createCart(nuevoCarrito);
    return res.status(200).json({
      status: 'success',
      message: 'Nuevo carrito creado correctamente',
      data: nuevoCarrito,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
};

const updateCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const { products } = req.body;

    const cart = await cartServices.updateCart(cartId, products);

    if (!cart) {
      res
        .status(404)
        .json({ status: 'error', message: 'Carrito no encontrado' });
    }
    res.status(200).json({
      status: 'success',
      message: 'Carrito actualizado correctamente',
      data: cart,
      products,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar el carrito' });
  }
};

const updateProdOfCart = async (req, res) => {
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

const deleteProdOfCart = async (req, res) => {
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

const deleteCart = async (req, res) => {
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
