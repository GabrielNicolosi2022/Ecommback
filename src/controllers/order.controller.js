import * as services from '../services/dataBase/orderServices.js';
import getLogger from '../utils/log.utils.js';

const log = getLogger();

const getAllOrders = async (req, res) => {
  try {
    const result = await services.getAll();
    if (!result) {
      log.error('No se encontraron órdenes');
      return res.status(404).send({ message: 'No se encontraron órdenes' });
    }
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    log.fatal('Error al obtener las ordenes. ' + error.message);
    res.status(500).json({ error: 'Error al obtener las ordenes' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await services.getOrderById(id);
    if (!result) {
      log.error(`La orden con id ${id} es inexistente`);
      res.status(404).json({ error: `La orden con id ${id} es inexistente` });
    }
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    log.fatal('Error al obtener la orden. ' + error.message);
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
};

export { getAllOrders, getOrderById };
