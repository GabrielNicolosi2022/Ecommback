import { getProductsById } from '../services/dataBase/prodServicesDB.js';
import { toLocaleFloat } from './numbers.utils.js';
import config from '../config/config.js';
import { devLog, prodLog } from '../config/customLogger.js';
let log;
config.environment.env === 'production' ? (log = prodLog) : (log = devLog);

export const createCartDTO = (products) => {
  const cartDTO = products.map((cartItem) => ({
    id: cartItem.product._id,
    title: cartItem.product.title,
    description: cartItem.product.description,
    code: cartItem.product.code,
    price: toLocaleFloat(cartItem.product.price),
    status: cartItem.product.status,
    stock: cartItem.product.stock,
    quantity: cartItem.quantity,
  }));
  return cartDTO;
};

export const calculateTotal = (products) => {
  return products.reduce((total, product) => {
    return total + product.product.price * product.quantity;
  }, 0);
};

export const decimalToInteger = (value) => {
  let valor = value;

  if (typeof value === 'number') {
    valor = value.toString();
  }

  const integerString = valor.split('.');
  const newIntegerString = integerString.join('');
  const integerValue = parseInt(newIntegerString);

  return integerValue;
};

export const separateProductsByStock = async (cart) => {
  const productsToProcess = [];
  const productsNotProcessed = [];

  // Validar el stock de los productos en el carrito y separar los productos sin stock
  for (const product of cart.products) {
    const productId = product.product;
    const quantityInCart = product.quantity;
    // Obtener el producto por ID desde la base de datos
    const productFromDB = await getProductsById(productId);
    if (!productFromDB) {
      productsNotProcessed.push(productId);
      log.error(
        `Producto con id ${productId._id} no encontrado en la base de datos`
      );
    } else if (productFromDB.stock >= quantityInCart) {
      productsToProcess.push({ productFromDB, quantityInCart });
    } else {
      productsNotProcessed.push({ productFromDB, quantityInCart });
    }
  }

  return { productsToProcess, productsNotProcessed };
};

export const processProducts = (productsArray) => {
  const processedProducts = [];

  for (const { productFromDB, quantityInCart } of productsArray) {
    processedProducts.push({
      product: productFromDB,
      quantity: quantityInCart,
    });
  }

  return processedProducts;
};
