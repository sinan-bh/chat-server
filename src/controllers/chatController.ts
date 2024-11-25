import { Request, Response } from 'express';
import Message from '../models/chatSchema';

export const getMessages = async (req: Request, res: Response) => {
  try {
    const messages = await Message.find().populate('userId', 'receiverId');
    res.status(200).json(messages);  // Return all messages with populated userId
  } catch (err) {
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

export const sendMessage = async (req: Request, res: Response) => {
  const { message, userId, receiverId } = req.body;

  console.log(receiverId);
  
  // Ensure the userId and message are received properly
  console.log("Received message:", message, "from userId:", userId);

  const newMessage = new Message({
    userId,  // The userId from the frontend (sender)
    message, // The message content
    receiverId: receiverId,
  });

  try {
    const savedMessage = await newMessage.save();
    res.status(201).json(savedMessage);  // Send back the saved message
  } catch (err) {
    console.error('Error saving message:', err);
    res.status(500).json({ message: 'Error sending message' });
  }
};
