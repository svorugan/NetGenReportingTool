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
  const systemPrompt = `You are an expert Oracle SQL assistant.
Given the following HR schema and user request, generate a single valid SQL query.

Schema:
${JSON.stringify(schema, null, 2)}

User request: ${prompt}

Rules:
- Use only the tables and columns provided.
- Follow the business rules exactly as defined in the schema.
- Pay special attention to the validValues for each column to ensure you use the correct values in WHERE clauses.
- For active employees, use CURRENT_EMPLOYEE_FLAG = 'Y'.
- For active assignments, follow the business rule: ASSIGNMENT_STATUS NOT IN ('Do Not Pay RU (DO NOT PROCESS)', 'LOA without Pay RU', 'LOAMA without Pay RU').
- For regular assignments (not on leave), use: ASSIGNMENT_STATUS NOT LIKE '%Leave%' AND ASSIGNMENT_STATUS NOT LIKE '%LOA%'.
- For paid assignments, use: ASSIGNMENT_STATUS NOT LIKE '%without Pay%' AND ASSIGNMENT_STATUS NOT LIKE '%w/o Pay%'.
- For primary assignments, use IS_PRIMARY_ASSIGNMENT = 'Y'.
- Use appropriate table aliases (e.g., p for PER_PEOPLE_AI_V, a for PER_ASSIGNMENTS_AI_V).
- Output only the SQL, no explanation.`;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'OpenAI API key is missing' });
  }

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
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    const sql = response.data.choices[0].message.content.trim();
    res.json({ sql });
  } catch (err: any) {
    res.status(500).json({ error: err.response?.data || err.message || 'Unknown error occurred' });
  }
});
