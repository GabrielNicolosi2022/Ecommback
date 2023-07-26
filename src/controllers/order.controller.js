import * as services from '../services/dataBase/orderServices.js';

const getAllOrders = async (req, res) => {
  try {
    const result = await services.getAll();
    if (!result)
      return res.status(404).send({ message: 'No se encontraron órdenes' });
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener las ordenes' });
  }
};

const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await services.getOrderById(id);
    if (!result)
      res.status(404).json({ error: `La orden con id ${id} es inexistente` });
    res.status(200).json({ status: 'success', data: result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al obtener la orden' });
  }
};

const createOrder = (req, res) => { 
    try {
        const {userId, cartId, products} = 
    } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error al crear la orden' });
    }
}



export {
    getAllOrders,
    getOrderById,
}