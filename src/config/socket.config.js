import getLogger from '../utils/log.utils.js';
import { Server } from 'socket.io';
import chatModel from '../models/schemas/ChatModel.js';
import { saveChat } from '../services/dataBase/chatServices.js';

const log = getLogger();

// Server Socket.io
export const configSocket = (server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    log.info('Socket connected');

    socket.on('message', async (data) => {
      log.info('data:', data);
      try {
        // Persistence in mongoDB
        const chat = await saveChat(data.user, data.message);
        const chats = await chatModel.find();
        io.emit('messageLogs', chats);
      } catch (error) {
        console.error('Error handling message:', error);
      }
    });

    socket.on('authenticated', (data) => {
      socket.broadcast.emit('newUserConnected', data);
    });
  });
};
