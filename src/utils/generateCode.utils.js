import OrderModel from '../models/schemas/OrderModel.js';

export const generateUniqueCode = async () => {
  try {
      // traer la última orden de la base de datos
    const lastOrder = await OrderModel.findOne().sort({ code: -1 });
  // Obtener el código de la última orden, si existe; de lo contrario, establecerlo en 0
    const lastCode = lastOrder ? lastOrder.code : 0;
  // devolver el código para la nueva orden incrementado en 1
  return lastCode + 1;

  } catch (error) {
    log.error('Error al generar el código único:', error.message);
    throw error; // Propaga el error hacia arriba
  }
};
