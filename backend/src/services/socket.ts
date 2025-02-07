import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';

interface CustomJwtPayload extends JwtPayload {
  userId: string;
}

class SocketService {
  private io: Server;

  constructor(server: HttpServer) {
    this.io = new Server(server, {
      cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:3000',
        methods: ['GET', 'POST']
      }
    });

    this.io.use((socket, next) => {
      const token = socket.handshake.auth.token;
      
      if (!token) {
        return next(new Error('Authentication error'));
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || '') as CustomJwtPayload;
        socket.data.userId = decoded.userId;
        next();
      } catch (error) {
        next(new Error('Authentication error'));
      }
    });

    this.io.on('connection', (socket) => {
      console.log('User connected:', socket.data.userId);

      socket.on('join-room', (roomId: string) => {
        socket.join(roomId);
      });

      socket.on('leave-room', (roomId: string) => {
        socket.leave(roomId);
      });

      socket.on('send-message', (data: { roomId: string; message: string }) => {
        this.io.to(data.roomId).emit('new-message', {
          userId: socket.data.userId,
          message: data.message,
          timestamp: new Date()
        });
      });

      socket.on('disconnect', () => {
        console.log('User disconnected:', socket.data.userId);
      });
    });
  }

  public getIO(): Server {
    return this.io;
  }
}

export default SocketService; 