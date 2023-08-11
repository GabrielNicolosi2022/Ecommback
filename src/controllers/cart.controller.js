import mongoose from 'mongoose';
import * as cartServices from '../services/dataBase/cartServicesDB.js';
import * as prodServices from '../services/dataBase/prodServicesDB.js';
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
    // log.info('userId: ', userId);

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
    const cid = req.params.cid;
    const { products } = req.body;
    const cartId = new mongoose.Types.ObjectId(cid);

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

    log.info('Carrito actualizado correctamente');
    res.status(200).json({
      status: 'success',
      message: 'Carrito actualizado correctamente',
      data: cart,
    });
  } catch (error) {
    log.fatal('Error al actualizar el carrito. ', error);
    res.status(500).json({ message: 'Error al actualizar el carrito', error });
  }
};

// Borrar un producto en el carrito (current user)
const deleteProdOfCart = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const pid = req.params.pid;

    const cart = await cartServices.getCartById(cartId);
    if (!cart) {
      log.error(`Carrito con id ${cartId} no encontrado`);
      return res.status(404).json({ message: 'Carrito no encontrado' });
    }
    const productInCart = cart.products.find((p) => p.product.equals(pid));

    if (!productInCart) {
      log.error(`Producto con id ${pid} no encontrado en el carrito`);
      return res
        .status(404)
        .json({ message: 'Producto no encontrado en el carrito' });
    }

    cart.products.splice(productInCart, 1);

    await cart.save();

    log.info('Producto removido correctamente del carrito' + cart);
    res
      .status(200)
      .json({ message: 'Producto removido correctamente del carrito', cart });
  } catch (error) {
    log.fatal('Error al eliminar el producto del carrito. ' + error.message);
    res
      .status(500)
      .json({ message: 'Error al eliminar el producto del carrito' });
  }
};
// Borrar un carrito (only admin)
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
// Finalizar la compra
const purchase = async (req, res) => {
  try {
    const cartId = req.params.cid;
    // log.info('cartId: ' + cartId);
    // Obtener el carrito por ID
    const cart = await cartServices.getCartById(cartId);
    // log.info('cart: ' + cart)
    // log.info('cart.products: ' + cart.products)
    if (!cart) {
      log.error(`Carrito con id ${cartId} no encontrado`);
      throw new Error('Carrito no encontrado');
    }

    const productsToProcess = [];
    const productsNotProcessed = [];
    // Validar el stock de los productos en el carrito y separar los productos sin stock
    for (const product of cart.products) {
      const productId = product.product;
      const quantityInCart = product.quantity;
      // Obtener el producto por ID desde la base de datos
      const productFromDB = await prodServices.getProductsById(productId);
      // log.info('productFromDb: ' + productFromDB._id);
      
      if (!productFromDB) {
        productsNotProcessed.push(productId);
        log.error(`Producto con id ${productId._id} no encontrado en la base de datos`);
      } else if (productFromDB.stock >= quantityInCart) {
        productsToProcess.push({ productFromDB, quantityInCart });
        log.info(`Producto con id ${productId._id} será procesado`);
      } else {
        productsNotProcessed.push(productId);
        log.warn(`Producto con id ${productId._id} no tiene suficiente stock`);
      }
    }
    // console.log('-------------------------------------------------------');
    // log.info('ProductToProcess: ' + productsToProcess);
    // log.info('ProductNotProcessed: ' + productsNotProcessed._id);
    // console.log('-------------------------------------------------------');
    
    const processedProducts = [];
    for (const { productFromDB, quantityInCart } of productsToProcess) {
      // Restar la cantidad comprada del stock del producto
      productFromDB.stock -= quantityInCart;
      // Guardar los cambios en la cantidad del producto en la base de datos
      await productFromDB.save();

      processedProducts.push({
        product: productFromDB,
        quantity: quantityInCart,
      });
    }
    // log.info('processedProducts: ' + processedProducts.product);
    // console.log('-------------------------------------------------------');
    
    // Actualizar el carrito en base a los productos procesados
    const remainingProducts = cart.products.filter(
      (prod) => productsNotProcessed.includes(prod.product) //?sino probar con processProducts
    );
    cart.products = remainingProducts;
    await cart.save();
    // log.info('productsNotProcessed: ' + productsNotProcessed);
    // log.info('Remaining products: ' + remainingProducts);
    // console.log('-------------------------------------------------------');
    
    let response = {
      message: 'Compra realizada exitosamente',
      processedProducts: processedProducts,
      remainingProducts: remainingProducts,
    };

    if (productsNotProcessed.length > 0) {
      log.warn('Algunos productos no pudieron ser procesados. ', remainingProducts);
      response.message = 'Algunos productos no pudieron ser procesados';
    }
    log.info('Compra realizada exitosamente.');
    res.status(200).json(response);
  } catch (error) {
    log.fatal('Error al realizar la compra. ' + error.message);
    res.status(500).send('Error al realizar la compra');
  }
  /*  
TODO: Al final, utilizar el servicio de Tickets para poder generar un ticket con los datos de la compra. 
*/
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
