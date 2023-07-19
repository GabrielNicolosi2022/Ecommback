import cartsModel from '../../models/schemas/CartModel.js';

class CartServices {
  constructor() {}

  getAllCarts = async () => await cartsModel.find().lean();

  getCartById = async (_Id) =>
    await cartsModel.findById(_Id).populate('products.product').lean();

  createCart = async (cartData) => await cartsModel.create(cartData);

  updateCart = async (cartId, products) =>
    await cartsModel
      .findByIdAndUpdate(cartId, { products }, { new: true })
      .populate('products.product')
      .lean();

  async addProductToCart(cartId, product) {
    try {

      const cart = await cartsModel.findByIdAndUpdate(
        cartId,
        { $push: { products: product } },
        { new: true }
      );

      console.log('Carrito actualizado:', cart);

      return cart;
    } catch (error) {
      throw new Error('Error al agregar el producto al carrito');
    }
  }

  async removeProductFromCart(cartId, productId) {
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
  }

  async deleteCart(cartId) {
    try {
      await cartsModel.findByIdAndRemove(cartId);
    } catch (error) {
      throw new Error('Error al eliminar el carrito');
    }
  }
}
//  ! Cambiar class por functions

export default CartServices;
