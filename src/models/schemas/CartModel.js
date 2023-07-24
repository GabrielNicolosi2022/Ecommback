import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';
import db from '../models/DAO/dbConnection.js';
import productsModel from './ProductModel.js';
const cartCollection = 'carts';

const cartProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  products: [cartProductSchema], // Este array products recibe los objetos(product) del modelo de arriba.
});
cartSchema.plugin(mongoosePaginate);

const cartsModel = db.model(cartCollection, cartSchema);

export default cartsModel;
