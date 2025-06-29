/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { Server } from 'socket.io';
import { v4 as uuidv4 } from 'uuid';

let ioInstance: Server | undefined;

export async function GET( ) {
  if (!ioInstance) {
    console.log('Initializing Socket.io server');
    ioInstance = new Server();

    ioInstance.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      socket.on('registerUser', (username) => {
        console.log(`User "${username}" connected with ID: ${socket.id}`);
      });

      socket.on('sendMessage', (msg: { sender: string; text: string }) => {
        const message = {
          id: uuidv4(),
          sender: msg.sender,
          text: msg.text,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          seenBy: [msg.sender], // Sender has seen their own message
        };
        ioInstance?.emit('receiveMessage', message);
      });

      socket.on('typing', (user) => {
        socket.broadcast.emit('userTyping', user);
      });

      socket.on('messageSeen', ({ messageId, user }: { messageId: string; user: string }) => {
        console.log(`Message ${messageId} seen by ${user}`);
        ioInstance?.emit('messageSeenUpdate', { messageId, user });
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    if (!(globalThis as any).io) {
      (globalThis as any).io = ioInstance; // Persist across serverless invocations
    }
  } else {
    console.log('Socket.io server already running');
  }

  return new NextResponse('Socket server initialized', { status: 200 });
}

export const config = {
  runtime: 'nodejs', // Ensure Node.js runtime for WebSocket support
};