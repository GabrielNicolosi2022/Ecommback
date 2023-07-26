import users from '../../models/schemas/UserModel.js';

const getAll = async () => await users.find().lean();

const getUserById = async (id) => await users.findOne({ _id: id }).lean();

const create = async (info) => await users.create(info).lean();

const updateUserById = async (id, info) => await users.updateOne({ _id: id }, { $set: info }).lean();

const updateTicketByUserId = async (id, ticketId) => await users.updateOne({ _id: id },{ $push: { tickets: ticketId }}).lean();
 
export {
  getAll,
  getUserById,
  create,
  updateUserById,
  updateTicketByUserId,
};
