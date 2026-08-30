import { Server as SocketIOServer } from 'socket.io';

let io = null;

export const initializeSocket = (server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CLIENT_URL || 'http://localhost:5173',
      credentials: true,
    },
    transports: ['websocket', 'polling'],
  });

  io.on('connection', (socket) => {
    console.log(`🟢 Client connected: ${socket.id}`);

    socket.on('join_user_room', (userId) => {
      if (userId) socket.join(`user_${userId}`);
    });

    socket.on('join_admin_room', () => {
      socket.join('admin_room');
    });

    socket.on('disconnect', () => {
      console.log(`🔴 Disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const emitTicketUpdate = (userId, ticketData) => {
  if (io) {
    io.to(`user_${userId}`).emit('ticket_updated', ticketData);
    io.to('admin_room').emit('ticket_updated', ticketData);
    console.log(`📤 Emitted ticket update for user ${userId}`);
  }
};