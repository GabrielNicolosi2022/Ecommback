import config from '../config/config.js';
import { getCartById } from '../services/dataBase/cartServicesDB.js';
import {
  separateProductsByStock,
  processProducts,
  calculateTotal,
} from '../utils/cart.utils.js';
import { getUserById } from '../services/dataBase/usersServices.js';
import { generateUniqueCode } from '../utils/generateCode.utils.js';
import { create as createOrder } from '../services/dataBase/orderServices.js';
import { updateProduct } from '../services/dataBase/prodServicesDB.js';
import { devLog, prodLog } from '../config/customLogger.js';
import { successfulPurchase } from '../utils/mail.utils.js';

let log;
config.environment.env === 'production' ? (log = prodLog) : (log = devLog);

const paymentSuccess = async (req, res) => {
  // Si el pago es exitoso, Restar la cantidad comprada del stock del producto y actualizar la base de datos
  const cartId = req.params.cid;

  try {
    const cart = await getCartById(cartId);
    if (!cart) {
      log.error(`paymentSuccess - Carrito con id ${cartId} no encontrado`);
      return res.status(404).send('Carrito no encontrado');
    }

    const { productsToProcess, productsNotProcessed } =
      await separateProductsByStock(cart);
    const processedProducts = processProducts(productsToProcess);

    // calcular total de la compra
    const totalAmount = calculateTotal(processedProducts);
    // generar código único para la orden
    const code = await generateUniqueCode();

    for (const { productFromDB, quantityInCart } of productsToProcess) {
      productFromDB.stock -= quantityInCart;
      await updateProduct(productFromDB._id, productFromDB.stock);
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

    successfulPurchase(newOrder, email, response);

    if (req.get('User-Agent').includes('Postman')) {
      log.info('paymentSuccess- Compra realizada exitosamente.' + newOrder);
      res.status(200).json({ response: response, order: newOrder });
    } else {
      const { code, purchase_datetime, amount, purchaser } = newOrder;

      req.flash(
        'success',
        `Compra realizada exitosamente! se le ha enviado un correo a ${purchaser} con los detalles de su compra.`
      );
      res.render('order', {
        title: 'EcommBack',
        pageTitle: 'Orden',
        code,
        purchase_datetime,
        amount,
        purchaser,
      });
    }
  } catch (error) {
    log.fatal('paymentSuccess - Error al finalizar la compra. ' + error);
    res.status(500).send('Error al finalizar la compra');
  }
};

const paymentCancel = (req, res) => {
  req.flash('error', 'La compra no ha podido ser completada');
  res.render('cancelPayment', {
    title: 'EcommBack',
    pageTitle: 'Mi Carrito',
  });
};

export { paymentSuccess, paymentCancel };
