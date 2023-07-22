import * as cartServices from '../services/dataBase/cartServicesDB.js';

// Traer todos los carritos
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
// Traer un carrito por Id
const getCartById = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartServices.getCartById(cartId);

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
// Crear un nuevo carrito
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
    const newCart = {
      products: products,
    };
    console.log(newCart);
    await cartServices.createCart(newCart);
    return res.status(200).json({
      status: 'success',
      message: 'Nuevo carrito creado correctamente',
      data: newCart,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
};
// Agregar mas productos al carrito
const updateCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const { products } = req.body;

    const cart = await cartServices.addProductToCart(cartId, products);

    if (!cart) {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
    res.status(200).json({
      status: 'success',
      message: 'Carrito actualizado correctamente',
      data: cart,
      products,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error al agregar el producto al carrito' });
  }
};
// Actualizar un producto en el carrito
const updateProdOfCart = async (req, res) => {
  // * Modificar método en service
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
// Borrar un producto en el carrito
const deleteProdOfCart = async (req, res) => { // !Buscar error
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    // console.log('cartId es:', cartId);
    // console.log('productId es:', typeof productId, productId);
    const cart = await cartServices.getCartById(cartId);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // console.log(cart.products);
    // ! No encuentra el product._id, en lugar de tomar products.product._id toma products._id
    const existingProductIndex = cart.products.findIndex(
      (p) => p._id.toString() === productId.toString()
    );
    // console.log(existingProductIndex)
    // console.log(cart.products.product._id)
    if (existingProductIndex === -1) {
      return res
        .status(404)
        .json({ message: 'Producto no encontrado en el carrito' });
    }

    cart.products.splice(existingProductIndex, 1);

    await cart.save();

    res.status(200).json({ message: 'Producto removido correctamente', cart });
  } catch (error) {
    res
      .status(500)
      .json({ message: 'Error al eliminar el producto del carrito' });
  }
};

const deleteCart = async (req, res) => {
  try {
    const _id = req.params.cid;

    const cart = await cartServices.getCartById(_id);
    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    await cartServices.deleteCart(cart);
    return res.json({
      status: 'success',
      message: 'Carrito eliminado correctamente',
      data: cart,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar el carrito' });
  }
};

// VISTAS
const viewCart = (req, res) => {
  res.render('cart', {
    title: 'EcommBack',
    pageTitle: 'Carrito',
    products: cart.products,
  });
};

const viewCartById = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartServices.getCartById(cartId);

    if (!cart) {
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    res.render('cart', {
      pageTitle: 'Carrito',
      products: cart.products,
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
  viewCart,
  viewCartById,
};
