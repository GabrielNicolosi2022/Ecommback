import mongoose from 'mongoose';

import mongoosePaginate from 'mongoose-paginate-v2';

import db from './dbConnection.js';

const cartCollection = 'carts';

const cartSchema = new mongoose.Schema({
  products: [
    {
      _id: Object,
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});
cartSchema.plugin(mongoosePaginate);

const cartsModel = db.model(cartCollection, cartSchema);

export default cartsModel;
