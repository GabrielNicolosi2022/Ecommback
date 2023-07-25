import TicketModel from '../../models/schemas/TicketModel.js';

const getAll = async () => await TicketModel.find().lean();
t;
const getTicketById = async (id) =>
  await TicketModel.findOne({ _id: id }).lean();

const create = async (info) => await TicketModel.create(info).lean();

const updateTicketById = async (id, newStatus) =>
  await TicketModel.updateOne(
    { _id: id },
    { $set: { status: newStatus } }
  ).lean();

export {
    getAll,
    getTicketById,
    create,
    updateTicketById
};
