import mongoose from 'mongoose';

const orderCollection = 'Order';

const orderSchema = new mongoose.Schema({
  code: {
    // debe auto generarse y ser único
    type: Number,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    // deberá guardar la fecha y hora exacta en la cual se formalizó la compra
    Type: Date,
    required: true,
    default: new Date(),
  },
  products: {
    type: Array, // productos en el carrito
  },
  amount: {
    // total de la compra
    type: Number,
    required: true,
  },
  purchaser: {
    type: mongoose.SchemaTypes.email, // correo del usuario asociado al carrito
    ref: 'User',
    required: true,
  },
  status: {
    type: String
  },
});

const order = mongoose.model(ticketCollection, ticketSchema);

export default order;
