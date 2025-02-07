import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';

export default function initializeSocket(server: HttpServer) {
  const io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      methods: ['GET', 'POST']
    }
  });

  const connectedUsers = new Map();

  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      socket.data.userId = decoded.userId;
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', (socket) => {
    const userId = socket.data.userId;
    connectedUsers.set(userId, socket.id);

    socket.on('sendMessage', async (message) => {
      const receiverSocketId = connectedUsers.get(message.receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit('newMessage', message);
      }
    });

    socket.on('disconnect', () => {
      connectedUsers.delete(userId);
    });
  });

  return io;
} 