import cartsModel from '../../models/schemas/CartModel.js';

// Trae todos todos los carritos
const getAllCarts = async () => await cartsModel.find().lean();

// Trae un carrito por id, se utiliza para traer el carrito a modificar en el controller y/o solo para buscar un carrito por id
const getCartById = async (cartId) =>
  await cartsModel.findById(cartId).populate('products.product').exec();

// Solo se utiliza cuando el user se hace login por primera vez
const createCart = async (userId, cartData) => {
  const newCart = {
    ...cartData,
    user: userId,
  };
  return await cartsModel.create(newCart);
};

const addProductToCart = async (cartId, products) =>
  await cartsModel.findByIdAndUpdate(
    cartId,
    { $push: { products: products } },
    { new: true }
  );

  // Se utiliza para agregar productos o modificar las cantidades de los mismos 
const updateCart = async (cartId, products) =>
  await cartsModel
    .findByIdAndUpdate(cartId, { $set: { products } }, { new: true })
    .lean();

/*   removeProductFromCart = async (cartId, productId) => {
    try {
      const cart = await cartsModel.findById(cartId);
      const index = cart.products.findIndex(
        (product) => product._id.toString() === productId
      );
      if (index > -1) {
        cart.products.splice(index, 1);
        await cart.save();
      }
      return cart;
    } catch (error) {
      throw new Error('Error al eliminar el producto del carrito');
    }
  };
 */

const deleteCart = async (cartId) => await cartsModel.findByIdAndRemove(cartId);

export {
  getAllCarts,
  getCartById,
  createCart,
  updateCart,
  addProductToCart,
  deleteCart,
};
