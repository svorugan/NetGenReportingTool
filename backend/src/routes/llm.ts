import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

export const llmRouter = express.Router();

// POST /generate-sql - generate SQL from natural language prompt
llmRouter.post('/generate-sql', async (req, res) => {
  const { prompt, schema } = req.body;
  if (!prompt || !schema) return res.status(400).json({ error: 'Prompt and schema are required' });

  // Compose LLM prompt with schema and user instructions
  const systemPrompt = `You are an expert Oracle SQL assistant.\nGiven the following HR schema and user request, generate a single valid SQL query.\n\nSchema:\n${JSON.stringify(schema, null, 2)}\n\nUser request: ${prompt}\n\nRules:\n- Use only the tables and columns provided.\n- Follow business logic: active employee = CURRENT_EMPLOYEE_FLAG = 'Y'; hiring year = PPS_DATE_START; etc.\n- Output only the SQL, no explanation.`;

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      temperature: 0,
      max_tokens: 512
    }, {
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      }
    });
    const sql = response.data.choices[0].message.content.trim();
    res.json({ sql });
  } catch (err) {
    res.status(500).json({ error: err.response?.data || err.message });
  }
});
