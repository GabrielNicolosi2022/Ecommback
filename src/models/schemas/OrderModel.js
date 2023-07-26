import mongoose from 'mongoose';

const orderCollection = 'Orders';

const orderSchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: true,
  },
  purchase_datetime: {
    // deberá guardar la fecha y hora exacta en la cual se formalizó la compra
    Type: 'date',
    required: true,
    default: Date.now,
  },
  products: {
    type: 'array', // productos en el carrito
  },
  amount: {
    // total de la compra
    type: 'number',
    required: true,
  },
  purchaser: {
    type: mongoose.SchemaTypes.email, // correo del usuario asociado al carrito
    ref: 'User',
    required: true,
  },
  status: { type: 'String' },
});

const order = mongoose.model(ticketCollection, ticketSchema);

export default order;
