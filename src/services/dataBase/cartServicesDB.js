import cartsModel from '../../models/schemas/CartModel.js';

const getAllCarts = async () => await cartsModel.find().lean();

const getCartById = async (cartId) =>
  await cartsModel.findById(cartId).populate('products.product').lean();

const createCart = async (newCart) => await cartsModel.create(newCart);

const addProductToCart = async (cartId, products) =>
  await cartsModel.findByIdAndUpdate(
    cartId,
    { $push: { products: products } },
    { new: true }
  );

// ! Sobreescribe los productos del carrito
const updateCart = async (cartId, products) =>
  await cartsModel
    .findByIdAndUpdate(cartId, { products }, { new: true })
    .populate('products.product')
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

export  {
  getAllCarts,
  getCartById,
  createCart,
  addProductToCart,
  deleteCart
};
