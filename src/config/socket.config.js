import { Server } from 'socket.io';
import chatModel from '../models/schemas/ChatModel.js';
import { saveChat } from '../services/dataBase/chatServices.js';

// Server Socket.io
export const configSocket = (server) => {
  const io = new Server(server);

  io.on('connection', (socket) => {
    console.log('Socket connected');

    socket.on('message', async (data) => {
      try {
        // Persistence in mongoDB
        const chat = await saveChat.saveChat(data.user, data.message);
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


