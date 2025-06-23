import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { oracleRouter } from './routes/oracle';
import { llmRouter } from './routes/llm';
import { personExtraInfoRouter } from './routes/personExtraInfo';
import { authRouter, verifyToken } from './routes/auth';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Public routes
app.use('/api/auth', authRouter);

// Protected routes
app.use('/api/oracle', verifyToken, oracleRouter);
app.use('/api/llm', verifyToken, llmRouter);
app.use('/api/person-extra-info', verifyToken, personExtraInfoRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
