import mongoose from 'mongoose';

const orderCollection = 'Order';

const orderSchema = new mongoose.Schema({
  // debe auto generarse y ser único
  code: {
    type: Number,
    unique: true,
    required: true,
  },
  // deberá guardar la fecha y hora exacta en la cual se formalizó la compra
  purchase_datetime: {
    type: Date,
    required: true,
    default: new Date(),
  },
  // total de la compra
  amount: {
    type: Number,
    required: true,
  },
  // correo del usuario asociado al carrito
  purchaser: {
    type: String,
    required: true,
  },
});

const order = mongoose.model(orderCollection, orderSchema);

export default order;
