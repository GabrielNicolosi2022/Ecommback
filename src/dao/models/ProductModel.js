import mongoose from 'mongoose';

import mongoosePaginate from 'mongoose-paginate-v2';

import db from './dbConnection.js';

const productCollection = 'products';

const productSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0.0,
    max: Number.MAX_VALUE,
  },
  status: {
    type: Boolean,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  thumbnails: {
    type: [String],
    required: false,
  },
});
productSchema.plugin(mongoosePaginate);

const productsModel = db.model(productCollection, productSchema);

export default productsModel;
