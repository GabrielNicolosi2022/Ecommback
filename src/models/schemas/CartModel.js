import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate-v2';

const cartCollection = 'carts';

const cartProductSchema = new mongoose.Schema({
  product: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'products',
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  products: [cartProductSchema], // Este array products recibe los objetos(product) del modelo de arriba.
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
  },
});

cartSchema.plugin(mongoosePaginate);

const cartsModel = mongoose.model(cartCollection, cartSchema);

export default cartsModel;
