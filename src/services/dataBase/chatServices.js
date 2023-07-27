import chatModel from "../../models/schemas/ChatModel.js";

const saveChat = async (user, message) => {
  try {
    const chat = await chatModel.create({ user, message });
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

