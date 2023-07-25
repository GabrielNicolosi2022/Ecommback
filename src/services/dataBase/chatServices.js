import chatModel from "../../models/schemas/ChatModel.js";

const getChatById = async (chatId) => await chatModel.findById(chatId).lean();

const saveChat = async (user, message) => await chatModel.save(user, message).lean();

const deleteChat = async (chatId) => await chatModel.findByIdAndDelete(chatId)

export {
    getChatById,
    saveChat,
    deleteChat,
}

