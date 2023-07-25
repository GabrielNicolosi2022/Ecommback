import mongoose from 'mongoose';

const ticketCollection = 'Ticket';

const ticketSchema = new mongoose.Schema({
  code: {
    type: 'string',
  },
  purchase_datetime: {
    Type: 'date', // deberá guardar la fecha y hora exacta en la cual se formalizó la compra
  },
  amount: {
    type: 'number', // total de la compra
  },
  purchaser: {
    type: mongoose.SchemaTypes.email, // correo del usuario asociado al carrito
    ref: 'User',
    
  },
});
