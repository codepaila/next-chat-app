

// server.js
import { createServer } from 'http';
import { parse } from 'url';
import next from 'next';
import { Server as SocketIOServer } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

let io;

app.prepare().then(() => {
  const server = createServer((req, res) => {
    const parsedUrl = parse(req.url || '', true);
    handle(req, res, parsedUrl);
  });

  io = new SocketIOServer(server, {
    path: '/api/socket',
    cors: {
      origin: '*',
    },
  });

  // Store connected users (optional, for seen logic)
  const connectedUsers = {};

  io.on('connection', (socket) => {
    console.log('Socket connected:', socket.id);

    // Assign a username to this socket (optional for advanced tracking)
    socket.on('registerUser', (username) => {
      connectedUsers[socket.id] = username;
      console.log(`User "${username}" connected with ID: ${socket.id}`);
    });
    // socket.on('sendMessage', (msg) => {
    //   const message = {
    //     ...msg,
    //     time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    //   };
    //   io.emit('receiveMessage', message);
    // });
    socket.on('sendMessage', (msg) => {
      const message = {
        id: uuidv4(),
        sender: msg.sender,
        text: msg.text,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        seenBy: [msg.sender], // Sender has seen their own message
      };

      io.emit('receiveMessage', message);
    });

    socket.on('typing', (user) => {
      socket.broadcast.emit('userTyping', user);
    });

    socket.on('messageSeen', ({ messageId, user }) => {
      console.log(`Message ${messageId} seen by ${user}`);
      io.emit('messageSeenUpdate', { messageId, user });
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected:', socket.id);
      delete connectedUsers[socket.id];
    });
  });

  server.listen(3000, () => {
    console.log('> Ready on http://localhost:3000');
  });
});
