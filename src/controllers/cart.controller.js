import getLogger from '../utils/log.utils.js';
import mongoose from 'mongoose';
import * as cartServices from '../services/dataBase/cartServicesDB.js';
import * as prodServices from '../services/dataBase/prodServicesDB.js';
import { toLocaleFloat } from '../utils/numbers.utils.js';
import {
  calculateTotal,
  decimalToInteger,
  separateProductsByStock,
  processProducts,
  createCartDTO,
} from '../utils/cart.utils.js';
import { createSession } from '../services/dataBase/paymentServices.js';

const log = getLogger();

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
      const products = cart.products;
      if (!cart) {
        req.flash('error', 'Carrito no encontrado');
        return res.redirect('/product');
      }
      // Separar los productos por Disponibilidad (Stock)
      const { productsToProcess, productsNotProcessed } =
        await separateProductsByStock(cart);
      const availableProducts = processProducts(productsToProcess);
      const notAvailableProducts = processProducts(productsNotProcessed);

      const availableProductsDTO = createCartDTO(availableProducts);
      const notAvailableProductsDTO = createCartDTO(notAvailableProducts);

      // Calcular el monto total de todos los productos en el carrito y monto real a abonar
      const totalPrice = calculateTotal(products);
      const currentAmount = calculateTotal(availableProducts);

      const totalCartAmount = toLocaleFloat(totalPrice);
      const totalToPay = toLocaleFloat(currentAmount);

      res.render('cart', {
        title: 'EcommBack',
        pageTitle: 'Mi Carrito',
        products: availableProductsDTO,
        productsNotProcessed: notAvailableProductsDTO,
        totalAmount: totalCartAmount,
        totalToPay: totalToPay,
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
    const product = await prodServices.getProductsById(pid);
    if (!product) {
      log.error(`Producto con id ${pid} no encontrado`);
      return res.status(404).send('Producto no encontrado');
    }
    const productTitle = product.title;

    const productIndex = cart.products.findIndex((p) => p.product.equals(pid));

    if (productIndex === -1) {
      log.error(
        `deleteProdOfCart - Producto con id ${pid} no encontrado en el carrito`
      );
      return res.status(404).send('Producto no encontrado en el carrito');
    }

    // Utiliza splice para eliminar el elemento en el índice encontrado
    cart.products.splice(productIndex, 1);

    await cart.save();

    if (req.get('User-Agent').includes('Postman')) {
      log.info(`Producto ${pid} removido correctamente del carrito` + cart);
      res
        .status(200)
        .json({ message: 'Producto removido correctamente del carrito', cart });
    } else {
      req.flash(
        'success',
        `Producto ${productTitle} removido correctamente del carrito`
      );
      res.redirect('/cart');
    }
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
    const cart = await cartServices.getCartById(cartId);
    if (!cart) {
      log.error(`purchase - Carrito con id ${cartId} no encontrado`);
      return res.status(404).send('Carrito no encontrado');
    }

    const { productsToProcess } = await separateProductsByStock(cart);

    const processedProducts = processProducts(productsToProcess);

    // Formatear los productos para poder ser procesados por Stipe
    const line_items = [];

    for (const item of processedProducts) {
      const product = item.product;

      const lineItem = {
        price_data: {
          product_data: {
            name: product.title,
            description: product.description,
          },
          currency: 'usd',
          unit_amount: decimalToInteger(product.price),
        },
        quantity: item.quantity,
      };

      line_items.push(lineItem);
    }

    // Intento de pago con Stripe
    const paymentInfo = {
      line_items,
      mode: 'payment',
      success_url: `/v1/api/payment/success/${cartId}`,
      cancel_url: `/v1/api/payment/cancel/${cartId}`,
    };

    const result = await createSession(paymentInfo);

    return res.status(200).redirect(result.url);
  } catch (error) {
    log.fatal('purchase - Error al realizar la compra. ' + error);
    res.status(500).send('Error al realizar la compra');
  }
};

export {
  createCart,
  getCarts,
  getCartById,
  getMyCart,
  updateCart,
  deleteProdOfCart,
  deleteCart,
  purchase,
  // viewCart,
  // paymentIntents,
};
