import express from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create router
export const authRouter = express.Router();

// Mock user database - in a real application, this would be stored in a database
const users = [
  {
    id: 1,
    username: 'admin',
    // In a real application, this would be a hashed password
    password: 'admin123',
    role: 'admin'
  },
  {
    id: 2,
    username: 'user',
    password: 'user123',
    role: 'user'
  }
];

// JWT secret key - in a real application, this would be in environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'netgen-reporting-tool-secret-key';

// Login endpoint
authRouter.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  // Find user
  const user = users.find(u => u.username === username && u.password === password);
  
  if (!user) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { 
      id: user.id, 
      username: user.username,
      role: user.role
    }, 
    JWT_SECRET, 
    { expiresIn: '24h' }
  );
  
  // Return token
  res.json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role
    }
  });
});

// Verify token middleware
export const verifyToken = (req: any, res: any, next: any) => {
  // Get token from header
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }
  
  const token = authHeader.split(' ')[1];
  
  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};
