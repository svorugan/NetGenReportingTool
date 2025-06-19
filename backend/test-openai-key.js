require('dotenv').config();
const axios = require('axios');

async function testOpenAIKey() {
  const apiKey = process.env.OPENAI_API_KEY;
  
  console.log('API Key (first 10 chars):', apiKey ? apiKey.substring(0, 10) + '...' : 'undefined');
  
  if (!apiKey) {
    console.error('Error: OpenAI API key is missing in .env file');
    return;
  }
  
  try {
    console.log('Testing OpenAI API connection...');
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo', // Using a simpler model for testing
      messages: [
        { role: 'user', content: 'Say hello' }
      ],
      max_tokens: 10
    }, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Success! API is working.');
    console.log('Response:', response.data.choices[0].message.content);
  } catch (error) {
    console.error('API Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

testOpenAIKey();
