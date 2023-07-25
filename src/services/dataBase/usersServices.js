import UserModel from '../../models/schemas/UserModel.js';

const getAll = async () => await UserModel.find().lean();

const getUserById = async (id) => await UserModel.findOne({ _id: id }).lean();

const create = async (info) => await UserModel.create(info).lean();

const updateUserById = async (id, info) =>
  await UserModel.updateOne({ _id: id }, { $set: info }).lean();

const updateTicketByUserId = async (id, ticketId) =>
  await UserModel.updateOne(
    { _id: id },
    { $push: { tickets: ticketId } }
  ).lean();
 
export {
  getAll,
  getUserById,
  create,
  updateUserById,
  updateTicketByUserId,
};
