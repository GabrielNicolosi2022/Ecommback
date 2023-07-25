import mongoose from 'mongoose';

const ticketCollection = 'Tickets';

const ticketSchema = new mongoose.Schema({
  code: {
    type: 'string', // código de compra para seguimiento
  },
  purchase_datetime: {
    Type: 'date', // deberá guardar la fecha y hora exacta en la cual se formalizó la compra
  },
  products: {
    type: 'array', // productos en el carrito
  },
  amount: {
    type: 'number', // total de la compra
  },
  purchaser: {
    type: mongoose.SchemaTypes.email, // correo del usuario asociado al carrito
    ref: 'User',
  },
  status: { type: 'String' },
});

const TicketModel = mongoose.model(ticketCollection, ticketSchema);

export default TicketModel;
