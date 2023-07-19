import cartServices from '../services/dataBase/cartServicesDB.js';
const cartManager = new cartServices();

/* const getCarts = async (req) => {
  try {
    const limit = parseInt(req.query.limit);
    const carts = await cartServices.getAllCarts();

    if (limit && !isNaN(limit) && limit > 0) {
      return carts.slice(0, limit);
    }
    return carts;
  } catch (err) {
    console.error(err);
    throw new Error('Error al obtener los carritos');
  }
};
 */
/* const getCartById = async (_id) => {
  try {
    const cart = await cartManager.getCartById(_id);

    if (!cart) {
      throw new Error('Carrito no encontrado');
    }
    return cart;
  } catch (error) {
    if (error.message === 'Carrito no encontrado') {
      throw error;
    }
    throw new Error('Error al obtener el carrito');
  }
};
 */

/* const createCart = async (products) => {
  try {
    if (!products) {
      throw new Error('No se han enviado productos para cargar en el carrito');
    }

    const nuevoCarrito = {
      products: products,
    };

    await cartManager.createCart(nuevoCarrito);
    return nuevoCarrito;
  } catch (error) {
    if (
      error.message === 'No se han enviado productos para cargar en el carrito'
    ) {
      throw error;
    }
    console.error(error);
    throw new Error('Error al crear el carrito');
  }
};
 */
/* const updateCart = async (cartId, products) => {
  try {
    const cart = await cartManager.getCartById(cartId);
    // console.log('cart del manager: ',cart)
    if (!cart) {
      throw new Error('Carrito no encontrado');
    }

    // cart.products = products;
    await cartManager.updateCart(cartId, cart);
    // await cart.save();

    return cart;
  } catch (error) {
    if (error.message === 'Carrito no encontrado') {
      throw error;
    }
    console.error(error);
    throw new Error('Error al actualizar el carrito');
  }
};
 */

/* const updateProdOfCart = () => {
  console.log('TO DO');
};

const deleteProdOfCart = () => {
  console.log('TO DO');
};

const deleteCart = () => {
  console.log('TO DO');
};
 */
export {
  // getCarts,
  // getCartById,
  // createCart,
  // updateCart,
  // updateProdOfCart,
  // deleteProdOfCart,
  // deleteCart,
};
