import mongoose from 'mongoose';
import cartsModel from '../../models/schemas/CartModel.js';

// Trae todos todos los carritos
const getAllCarts = async () => await cartsModel.find().lean();

// Trae un carrito por id, se utiliza para traer el carrito a modificar en el controller y/o solo para buscar un carrito por id
const getCartById = async (cartId) =>
  await cartsModel.findById(cartId).populate('products.product').exec();

// Obtener el carrito del usuario por su ID de usuario
const getCartByUserId = async (userId) =>
  await cartsModel
    .findOne({ user: userId })
    .populate('products.product')
    .exec();

// Solo se utiliza cuando el user se hace login por primera vez
const createCart = async (userId, cartData) => {
  const newCart = {
    ...cartData,
    user: userId,
  };
  return await cartsModel.create(newCart).exec();
};

// no se utiliza
/* const addProductToCart = async (cartId, products) =>
  await cartsModel.findByIdAndUpdate(
    cartId,
    { $push: { products: products } },
    { new: true }
  );
 */
// Se utiliza para agregar productos o modificar las cantidades de los mismos
const updateCart = async (cartId, products) =>
  await cartsModel
    .findByIdAndUpdate(cartId, { $set: { products } }, { new: true })
    .lean();

const deleteCart = async (cartId) => await cartsModel.findByIdAndRemove(cartId);



export {
  getAllCarts,
  getCartById,
  getCartByUserId,
  createCart,
  updateCart,
  // addProductToCart,
  deleteCart,
};
