import order from '../../models/schemas/OrderModel.js';

const getAll = async () => await order.find().lean();

const getOrderById = async (id) => await order.findOne({ _id: id }).lean();

const create = async (orderInfo) => await order.create(orderInfo);

const updateOrderById = async (id, newStatus) =>
  await order.updateOne({ _id: id }, { $set: { status: newStatus } }).lean();

export {
  getAll,
  getOrderById,
  create,
  updateOrderById
};
