import users from '../../models/schemas/UserModel.js';

const getAll = async () => await users.find().lean();

const getUserById = async (id) => await users.findOne({ _id: id }).lean();

const getUserByEmail = async (email) => await users.findOne({ email: email });

const create = async (info) => await users.create(info).lean();

const updateUserById = async (id, info) => await users.updateOne({ _id: id }, { $set: info }).lean();

const updatePasswordByEmail = async (email, hashedPassword) =>
  await users.updateOne(
    { email: email },
    { $set: { password: hashedPassword } }
  );

const updateTicketByUserId = async (id, ticketId) => await users.updateOne({ _id: id },{ $push: { tickets: ticketId }}).lean();
 
export {
  getAll,
  getUserById,
  getUserByEmail,
  create,
  updateUserById,
  updatePasswordByEmail,
  updateTicketByUserId,
};
