import chatModel from "../../models/schemas/ChatModel.js";
import userModel from '../../models/schemas/UserModel.js';
import getLogger from '../utils/log.utils.js';

const log = getLogger();

const saveChat = async (req, message) => {
  try {
    const userId = req.session; //! no está obteniendo la req.session
    log.info('userId: ', userId)
    const user = await userModel.findOne({ _id: userId });
    const userMongoId = user._id;
    log.info('user: ',user);
    const chat = await chatModel.create({ userMongoId, message });
    return chat;
  } catch (error) {
    console.error('Error saving chat:', error);
    throw error;
  }
};

const getChatById = async (chatId) => {
  try {
    const chat = await chatModel.findById(chatId).lean();
    return chat;
  } catch (error) {
    console.error('Error getting chat by ID:', error);
    throw error;
  }
};

const deleteChat = async (chatId) => {
  try {
    const deletedChat = await chatModel.findByIdAndDelete(chatId);
    return deletedChat;
  } catch (error) {
    console.error('Error deleting chat:', error);
    throw error;
  }
};

/* const getChatById = async (chatId) => await chatModel.findById(chatId).lean();

const saveChat = async (user, message) => await chatModel.insertMany(user, message);

const deleteChat = async (chatId) => await chatModel.findByIdAndDelete(chatId)
 */
export {
    getChatById,
    saveChat,
    deleteChat,
}

