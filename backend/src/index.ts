import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { oracleRouter } from './routes/oracle';
import { llmRouter } from './routes/llm';

// Load environment variables
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/oracle', oracleRouter);
app.use('/api/llm', llmRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
});
