require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

async function testSQLOutput() {
  try {
    // Get the schema
    const schemaResponse = await axios.get('http://localhost:4000/api/oracle/schema');
    const schema = schemaResponse.data;
    
    // Generate SQL
    const response = await axios.post('http://localhost:4000/api/llm/generate-sql', {
      prompt: 'Show me all active employees with paid assignments',
      schema: schema
    });
    
    const sql = response.data.sql;
    
    // Save SQL to file
    fs.writeFileSync('sql-output.txt', sql, 'utf8');
    console.log('SQL saved to sql-output.txt');
    
    // Read and display the file contents
    const fileContent = fs.readFileSync('sql-output.txt', 'utf8');
    console.log('\nSQL Query:');
    console.log(fileContent);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testSQLOutput();
