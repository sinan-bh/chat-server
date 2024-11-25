
import {server} from './server'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/userRoutes';
import chatRoutes from './routes/chatRoutes';
import cors from 'cors'
import express, { Request, Response } from 'express';

import { app } from './server';

dotenv.config();


const corsOptions = {
  origin: 'http://localhost:3000', 
  methods: ['GET', 'POST', 'PUT', 'DELETE'],  
};

app.use(cors(corsOptions));

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);


mongoose.connect(process.env.MONGO_URI as string)
  .then(() => console.log('MongoDB connected'))
  .catch((err: any) => console.log(err));


const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
