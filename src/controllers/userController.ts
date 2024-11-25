import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/userSchema';

export const register = async (req: Request, res: Response): Promise<void> => {
  const { username, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
     res.status(400).json({ message: 'User already exists' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    const user = await newUser.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error registering user' });
  }
};

export const loginUser = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
  
    try {
      const user = await User.findOne({ email });
  
      // Check if the user exists
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Compare the password with the stored hashed password
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
         return res.status(400).json({ message: 'Invalid credentials' });
      }

      // Generate a JWT token
      const token = jwt.sign(
        { userId: user._id, email: user.email },
        process.env.JWT_SECRET as string,  // You need to set a JWT secret in your .env
        { expiresIn: '1h' }  // Token expires in 1 hour
      );
  
      // Return user data and token
      res.status(200).json({
        message: 'Login successful',
        token,  // Send the JWT token back
        user: { id: user._id, username: user.username, email: user.email }
      });
    } catch (error) {
      res.status(500).json({ message: 'Server error' });
    }
};

export const allUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetch all users from the database
    const users = await User.find();
    
    // Check if users exist
    if (!users || users.length === 0) {
       res.status(404).json({ message: "No users found" });
    }

    //  the users with a success message
     res.status(200).json({
      message: "Successfully retrieved users",
      users
    });
  } catch (error: any) {
    console.error("Error retrieving users:", error.message);
     res.status(500).json({ message: "Error retrieving users", error: error.message });
  }
};