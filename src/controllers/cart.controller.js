import mongoose from 'mongoose';
import * as cartServices from '../services/dataBase/cartServicesDB.js';
import config from '../config/config.js';
import { devLog, prodLog } from '../config/customLogger.js';

let log;
config.environment.env === 'production' ? (log = prodLog) : (log = devLog);

// Obtener todos los carritos
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
    log.fatal('Error al obtener los carritos. ' + error.message);
    res
      .status(500)
      .json({ status: 'error', error: 'Error al obtener los carritos' });
  }
};
// Obtener un carrito por Id
const getCartById = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartServices.getCartById(cartId);

    if (!cart) {
      log.error(`Carrito con id ${cartId} no encontrado`);
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
    log.fatal('Error al obtener el carrito. ' + error.message);
    return res.status(500).json({
      status: 'error',
      message: 'Error al obtener el carrito',
    });
  }
};
// Obtener el carrito del usuario
const getMyCart = async (req, res) => {
  try {
    const userId = req.params.uid;
    console.log('userId', userId);

    // Obtener el carrito del usuario desde la base de datos
    const cart = await cartServices.getCartByUserId(userId);

    if (!cart) {
      log.error(`Carrito del usuario ${userId} no encontrado`);
      return res
        .status(404)
        .json({ message: 'Carrito no encontrado para este usuario' });
    }

    res.status(200).json({
      status: 'success',
      message: 'Carrito del usuario encontrado',
      data: cart,
    });
  } catch (error) {
    log.fatal('Error al obtener el carrito del usuario. ', error.message);
    res
      .status(500)
      .json({ message: 'Error al obtener el carrito del usuario. ', error });
  }
};
// Crear un nuevo carrito
const createCart = async (req, res) => {
  try {
    const { products } = req.body;
    // console.log({ products });
    if (!products) {
      log.error('No se han enviado productos para cargar en el carrito');
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
    log.fatal('Error al crear el carrito. ' + error.message);
    res.status(500).json({ error: 'Error al crear el carrito' });
  }
};

// Actualizar el carrito
const updateCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const { products } = req.body;
    // console.log('products: ', products);
    // Buscar el carrito por su ID
    const cart = await cartServices.getCartById(cartId);

    if (!cart) {
      log.error(`Carrito con id ${cartId} no encontrado`);
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    // Iterar sobre los productos del body
    for (const product of products) {
      const productInCart = cart.products.find((p) =>
        p.product.equals(new mongoose.Types.ObjectId(product.product))
      );
      // Si el producto ya existe en el carrito, actualizar la cantidad
      if (productInCart) {
        productInCart.quantity = product.quantity;
      } else {
        // Si el producto no existe en el carrito, agregarlo
        cart.products.push({
          product: new mongoose.Types.ObjectId(product.product),
          quantity: product.quantity,
        });
      }
    }
    // Guardar el nuevo carrito en la base de datos
    await cartServices.updateCart(cartId, cart.products);

    res.status(200).json({
      status: 'success',
      message: 'Carrito actualizado correctamente',
      data: cart,
    });
  } catch (error) {
    log.fatal('Error al actualizar el carrito. ', error.message);
    res.status(500).json({ message: 'Error al actualizar el carrito', error });
  }
};

// Actualizar un producto en el carrito (reemplazado por updateCart)
/* const updateProdOfCart = async (req, res) => {
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
 */

// Borrar un producto en el carrito
const deleteProdOfCart = async (req, res) => {
  // !Buscar error
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    // console.log('cartId es:', cartId);
    // console.log('productId es:', typeof productId, productId);
    const cart = await cartServices.getCartById(cartId);
    if (!cart) {
      log.error(`Carrito con id ${cartId} no encontrado`);
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // log.info(cart.products);
    // ! No encuentra el product._id, en lugar de tomar products.product._id toma products._id
    const existingProductIndex = cart.products.findIndex(
      (p) => p._id.toString() === productId.toString()
    );
    // log.info(existingProductIndex)
    // log.info(cart.products.product._id)
    if (existingProductIndex === -1) {
      log.error(`Producto con id ${productId} no encontrado en el carrito`);
      return res
        .status(404)
        .json({ message: 'Producto no encontrado en el carrito' });
    }

    cart.products.splice(existingProductIndex, 1);

    await cart.save();

    res.status(200).json({ message: 'Producto removido correctamente', cart });
  } catch (error) {
    log.fatal('Error al eliminar el producto del carrito. ' + error.message);
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
      log.error(`Carrito con id ${_id} no encontrado`);
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    await cartServices.deleteCart(cart);
    return res.json({
      status: 'success',
      message: 'Carrito eliminado correctamente',
      data: cart,
    });
  } catch (error) {
    log.fatal('Error al eliminar el carrito. ' + error.message);
    res.status(500).json({ message: 'Error al eliminar el carrito' });
  }
};

// todo: Falta segmentar el método de purchase dentro del controller de carts. SOLO en ese método estas mezclando responsabilidades del controller y del servicio.
const purchase = async (req, res) => {
  try {
    const cartId = req.params.cid;

    // Obtener el carrito por ID
    const cart = await cartServices.getCartById(cartId);

    if (!cart) {
      log.error(`Carrito con id ${cartId} no encontrado`);
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }

    // Validar el stock de los productos en el carrito
    for (const product of cart.products) {
      const productId = product._id;
      const quantityInCart = product.quantity;

      // Obtener el producto por ID desde la base de datos
      const productFromDB = await productService.getProductById(productId);

      if (!productFromDB) {
        log.error(`Producto con id ${productId} no encontrado`);
        return res
          .status(404)
          .json({ message: `Producto con ID ${productId} no encontrado` });
      }

      // Verificar si hay suficiente stock para la cantidad en el carrito
      if (productFromDB.stock < quantityInCart) {
        log.warn(
          `No hay suficiente stock para el producto con ID ${productId}`
        );
        return res.status(400).json({
          message: `No hay suficiente stock para el producto con ID ${productId}`,
          availableStock: productFromDB.stock,
        });
      }

      // Restar la cantidad comprada del stock del producto
      productFromDB.stock -= quantityInCart;

      // Guardar los cambios en el producto en la base de datos
      await productFromDB.save();
    }

    /*  
  TODO: Al final, utilizar el servicio de Tickets para poder generar un ticket con los datos de la compra. En caso de existir una compra no completada, devolver el arreglo con los ids de los productos que no pudieron procesarse. Una vez finalizada la compra, el carrito asociado al usuario que compró deberá contener sólo los productos que no pudieron comprarse. Es decir, se filtran los que sí se compraron y se quedan aquellos que no tenían disponibilidad.
 */

    res.status(200).json({ message: 'Compra realizada exitosamente' });
  } catch (error) {
    log.fatal('Error al realizar la compra. ', error.message);
    res.status(500).json({ message: 'Error al realizar la compra', error });
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
  getMyCart,
  createCart,
  updateCart,
  // updateProdOfCart,
  deleteProdOfCart,
  deleteCart,
  viewCart,
  viewCartById,
  purchase,
};
