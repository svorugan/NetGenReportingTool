const axios = require('axios');
require('dotenv').config();

async function testDirectSQL() {
  try {
    // Get the schema first
    const schemaResponse = await axios.get('http://localhost:4000/api/oracle/schema');
    const schema = schemaResponse.data;
    console.log('Schema fetched successfully');
    
    // Make the request to generate SQL
    console.log('\nSending query to generate SQL...');
    const response = await axios.post('http://localhost:4000/api/llm/generate-sql', {
      prompt: 'Show me all active employees with paid assignments',
      schema: schema
    });
    
    // Display the full SQL
    console.log('\nGenerated SQL:');
    console.log('----------------------------------------');
    console.log(response.data.sql);
    console.log('----------------------------------------');
    
  } catch (error) {
    if (error.response) {
      console.error('Error Status:', error.response.status);
      console.error('Error Data:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }
  }
}

testDirectSQL();
