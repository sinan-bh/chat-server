import Message from './models/chatSchema'; 
import { createServer } from 'http';
import { Server } from 'socket.io';
import express, { Request, Response } from 'express';

export const app = express();

export const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000', // Allow your frontend origin (e.g., React app running on port 3000)
    methods: ['GET', 'POST'],
  },
});

// WebSocket logic
io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('sendMessage', async (message) => {
    try {
      // Ensure message structure
      console.log("Message received:", message);

      const newMessage = new Message({
        userId: message.senderId,  // Correctly use the senderId
        message: message.content,
        receiverId: message.receiverId   // Store message content
      });

      const savedMessage = await newMessage.save();
      console.log("Message saved:", savedMessage);

      // Emit the saved message to all connected clients
      io.emit('receiveMessage', savedMessage);
    } catch (err) {
      console.error('Error saving message to database:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});





