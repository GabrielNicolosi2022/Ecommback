import mongoose from 'mongoose';
import * as cartServices from '../services/dataBase/cartServicesDB.js';
import * as prodServices from '../services/dataBase/prodServicesDB.js';
import { getUserById } from '../services/dataBase/usersServices.js';
import { generateUniqueCode } from '../utils/generateCode.utils.js';
import { create as createOrder } from '../services/dataBase/orderServices.js';
import { toLocaleFloat } from '../utils/numbers.utils.js';
import config from '../config/config.js';
import { devLog, prodLog } from '../config/customLogger.js';
import { calculateTotal, decimalToInteger } from '../utils/cart.utils.js';
import { createPaymentIntent } from '../services/dataBase/paymentServices.js';

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
    return res.status(200).json({
      status: 'success',
      message: 'Carritos encontrados',
      data: carts,
    });
  } catch (error) {
    log.fatal('Error al obtener los carritos. ' + error.message);
    res.status(500).send('Error interno');
  }
};
// Obtener un carrito por Id
const getCartById = async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cart = await cartServices.getCartById(cartId);

    if (!cart) {
      log.error(`Carrito con id ${cartId} no encontrado`);
      return res.status(404).send('Carrito no encontrado');
    }

    res.status(200).json({
      status: 'success',
      message: 'Carrito encontrado satisfactoriamente',
      data: cart,
    });
  } catch (error) {
    log.fatal('Error al obtener el carrito. ' + error.message);
    return res.status(500).send('Error interno');
  }
};
// Obtener el carrito del usuario
const getMyCart = async (req, res) => {
  try {
    if (req.get('User-Agent').includes('Postman')) {
      const userId = req.params.uid;
      // Obtener el carrito del usuario desde la base de datos
      const cart = await cartServices.getCartByUserId(userId);

      if (!cart) {
        log.error(`Carrito del usuario ${userId} no encontrado`);
        return res.status(404).send('Carrito no encontrado');
      }

      res.status(200).json({
        status: 'success',
        message: 'Carrito del usuario encontrado satisfactoriamente',
        data: cart,
      });
    } else {
      const cartId = req.session.user.cart;
      const cart = await cartServices.getCartById(cartId);

      if (!cart) {
        req.flash('error', 'Carrito no encontrado');
        return res.redirect('/product');
      }

      const cartDTO = cart.products.map((cartItem) => ({
        title: cartItem.product.title,
        description: cartItem.product.description,
        code: cartItem.product.code,
        price: toLocaleFloat(cartItem.product.price),
        status: cartItem.product.status,
        stock: cartItem.product.stock,
        quantity: cartItem.quantity,
      }));

      // Calcular el monto total de todos los productos en el carrito
      const totalPrice = cart.products.reduce((total, product) => {
        const productPrice = product.product.price;
        const quantity = product.quantity;

        return total + productPrice * quantity;
      }, 0);
      const totalAmount = toLocaleFloat(totalPrice);

      res.render('cart', {
        title: 'EcommBack',
        pageTitle: 'Mi Carrito',
        products: cartDTO,
        totalAmount: totalAmount,
        cartId,
      });
    }
  } catch (error) {
    log.fatal('Error al obtener el carrito del usuario. ', error);
    res.status(500).send('Error interno');
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
    res.status(500).send('Error interno');
  }
};

// Actualizar el carrito
const updateCart = async (req, res) => {
  try {
    const cid = req.params.cid;
    const cartId = new mongoose.Types.ObjectId(cid);
    const { user } = req.session;

    if (req.get('User-Agent') && req.get('User-Agent').includes('Postman')) {
      const { products } = req.body;

      // Buscar el carrito por su ID
      const cart = await cartServices.getCartById(cartId);

      if (!cart) {
        log.error(`Carrito con id ${cartId} no encontrado`);
        return res.status(404).send('Carrito no encontrado');
      }

      // Iterar sobre los productos del body
      for (const product of products) {
        const productId = product.product;
        const prodFromDb = await prodServices.getProductsById(productId);

        if (user.role === 'premium') {
          if (prodFromDb.owner) {
            //  Filtrar los productos que son propiedad del usuario
            const ownedProducts = products.filter((productItem) => {
              const productOwner = prodFromDb.owner.toString();
              return productOwner === user.userId;
            });
            // si hay productos de su propiedad en el carrito, no permitir agregarlos
            if (ownedProducts.length > 0) {
              log.warn(
                'El cliente está intentando agregar al carrito un producto de su propiedad'
              );
              return res.status(403).send('Acción inválida');
            }
          }
        }

        const productInCart = cart.products.find((p) =>
          p.product.equals(new mongoose.Types.ObjectId(product.product))
        );

        if (productInCart) {
          // Si el producto ya existe en el carrito, actualizar la cantidad
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
    } else {
      const { productId, quantity } = req.body;
      // Buscar el carrito por su ID
      const cart = await cartServices.getCartById(cartId);

      if (!cart) {
        req.flash(`Carrito no encontrado`);
        return res.status(404).send('Carrito no encontrado');
      }

      if (!productId) {
        req.flash('No se ha proporcionado el ID del producto');
        return res.status(400).json({
          status: 'error',
          message: 'No se ha proporcionado el ID del producto',
        });
      }

      const prodFromDb = await prodServices.getProductsById(productId);

      if (user.role === 'premium') {
        if (prodFromDb.owner) {
          const productOwner = prodFromDb.owner.toString();
          if (productOwner === user.userId) {
            req.flash('Acción inválida');
            return res.status(403).send('Acción inválida');
          }
        }
      }
      const productInCart = cart.products.find((p) =>
        p.product.equals(new mongoose.Types.ObjectId(productId))
      );

      if (productInCart) {
        // Si el producto ya existe en el carrito, actualizar la cantidad
        productInCart.quantity = quantity;
      } else {
        // Si el producto no existe en el carrito, agregarlo
        cart.products.push({
          product: new mongoose.Types.ObjectId(productId),
          quantity: quantity,
        });
      }
      // Guardar el nuevo carrito en la base de datos
      await cartServices.updateCart(cartId, cart.products);

      req.flash(
        'success',
        `Se han cargado al carrito ${quantity} un. del producto ${prodFromDb.title} correctamente`
      );
      res.redirect('/product');
    }
  } catch (error) {
    log.fatal('Error al actualizar el carrito. ', error);
    res.status(500).json('Error interno');
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
      return res.status(404).send('Carrito no encontrado');
    }
    const productInCart = cart.products.find((p) => p.product.equals(pid));

    if (!productInCart) {
      log.error(`Producto con id ${pid} no encontrado en el carrito`);
      return res.status(404).send('Producto no encontrado en el carrito');
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
      return res.status(404).send('Carrito no encontrado');
    }
    await cartServices.deleteCart(cart);
    return res.status(200).json({
      status: 'success',
      message: 'Carrito eliminado correctamente',
      data: cart,
    });
  } catch (error) {
    log.fatal('Error al eliminar el carrito. ' + error.message);
    res.status(500).send('Error interno');
  }
};

// Finalizar la compra
const purchase = async (req, res) => {
  const cartId = req.params.cid;

  try {
    // Obtener el carrito por ID
    const cart = await cartServices.getCartById(cartId);
    if (!cart) {
      log.error(`Carrito con id ${cartId} no encontrado`);
      return res.status(404).send('Carrito no encontrado');
    }

    const productsToProcess = [];
    const productsNotProcessed = [];

    // Validar el stock de los productos en el carrito y separar los productos sin stock
    for (const product of cart.products) {
      const productId = product.product;
      const quantityInCart = product.quantity;
      // Obtener el producto por ID desde la base de datos
      const productFromDB = await prodServices.getProductsById(productId);
      if (!productFromDB) {
        productsNotProcessed.push(productId);
        log.error(
          `Producto con id ${productId._id} no encontrado en la base de datos`
        );
      } else if (productFromDB.stock >= quantityInCart) {
        productsToProcess.push({ productFromDB, quantityInCart });
        log.info(
          `${quantityInCart} ud. del producto con id ${productId._id} serán procesadas.`
        );
      } else {
        productsNotProcessed.push(productId);
        log.warn(`Producto con id ${productId._id} no tiene suficiente stock`);
      }
    }

    const processedProducts = [];
    for (const { productFromDB, quantityInCart } of productsToProcess) {
      processedProducts.push({
        product: productFromDB,
        quantity: quantityInCart,
      });
    }

    // calcular total de la compra
    const totalAmount = calculateTotal(processedProducts);
    // generar código único para la orden
    const code = await generateUniqueCode();

    /*     // Si el pago es exitoso, Restar la cantidad comprada del stock del producto y actualizar la base de datos
    for (const { productFromDB, quantityInCart } of productsToProcess) {
      productFromDB.stock -= quantityInCart;
      await prodServices.updateProduct(productFromDB._id, productFromDB.stock);
    }

    // Actualizar el carrito en base a los productos procesados
    const remainingProducts = cart.products.filter((prod) =>
      productsNotProcessed.includes(prod.product)
    );
    cart.products = remainingProducts;
    await cart.save();

    let response = {
      message: 'Compra realizada exitosamente',
      processedProducts: processedProducts,
      remainingProducts: remainingProducts,
    };

    if (productsNotProcessed.length > 0) {
      log.warn(
        'Algunos productos no pudieron ser procesados. ',
        remainingProducts
      );
      response.message = 'Algunos productos no pudieron ser procesados';
    }

    // crear ticket con los datos de la compra
    const { email } = await getUserById(cart.user);

    const orderInfo = {
      code: code,
      purchase_datetime: new Date(),
      amount: totalAmount,
      purchaser: email,
    };

    const newOrder = await createOrder(orderInfo);
 
    log.info('Compra realizada exitosamente.' + newOrder);
    res.status(200).json({ response: response, order: newOrder });
 */
  } catch (error) {
    log.fatal('Error al realizar la compra. ' + error);
    res.status(500).send('Error al realizar la compra');
  }
};

// VISTAS
const viewCart = (req, res) => {
  res.render('cart', {
    title: 'EcommBack',
    pageTitle: 'Carrito',
    products: req.session.user.cart,
  });
};
// Intento de pago con Stripe
const paymentIntents = async (req, res) => {
  const {totalAmount} = req.query;

  const paymentInfo = {
    amount: decimalToInteger(totalAmount),
    currency: 'ars',
  };

  const result = await createPaymentIntent(paymentInfo);
  
  if (!result) {
    log.error(
      'Purchase - createPaymentIntent: Error al Enviar información a Stripe'
      );
      return res.status(400).send('Mala Petición');
  }

  log.info(
    `paymentIntents - createPaymentIntent: Se creó un nuevo intento de pago (${result.id})`
    );
    console.log('paymentIntents - createPaymentIntent: client_secret enviada al front');
    
  // Renderizar la vista de pago y pasa la clientSecret como variable de contexto
  res.render('payment', {
    title: 'EcommBack',
    pageTitle: 'Formulario de Pago',
    clientSecret: result.client_secret,
  });
};

export {
  createCart,
  getCarts,
  getCartById,
  getMyCart,
  updateCart,
  deleteProdOfCart,
  deleteCart,
  viewCart,
  purchase,
  paymentIntents,
};
