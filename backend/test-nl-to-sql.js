const axios = require('axios');
require('dotenv').config(); // Load environment variables

// Hardcoded schema in case the API call fails
const HR_SCHEMA = {
  tables: [
    {
      name: 'PER_PEOPLE_AI_V',
      description: 'Stores employee names, gender, birthdate.',
      columns: [
        'PERSON_ID (PK)', 'FIRST_NAME', 'MIDDLE_NAME', 'LAST_NAME', 'FULL_NAME',
        'EFFECTIVE_START_DATE', 'EFFECTIVE_END_DATE', 'USER_PERSON_TYPE', 'CURRENT_EMPLOYEE_FLAG',
        'DATE_OF_BIRTH', 'SEX', 'BENEFIT_GROUP', 'ORIGINAL_DATE_OF_HIRE', 'NATIONALITY',
        'REGISTERED_DISABLED_FLAG', 'OFFICE_NUMBER', 'INTERNAL_LOCATION', 'MAILSTOP',
        'PERSON_TYPE', 'PPS_DATE_START', 'ACTUAL_TERMINATION_DATE', 'LEAVING_REASON'
      ]
    },
    {
      name: 'PER_ASSIGNMENTS_AI_V',
      description: 'Stores current (as of sysdate) assignment information for employees, including job, organization, and payroll details.',
      columns: [
        'PERSON_ID (FK)', 'ASSIGNMENT_ID (PK)', 'JOB_NAME', 'ORGANIZATION_NAME', 'POSITION_NAME',
        'PAYROLL_NAME', 'ASSIGNMENT_STATUS', 'ASSIGNMENT_TYPE', 'GRADE', 'EMPLOYMENT_TYPE', 'IS_PRIMARY_ASSIGNMENT'
      ]
    }
  ]
};

async function testNLToSQL() {
  let schema = HR_SCHEMA;
  
  try {
    // First, get the schema from the API
    console.log('Fetching schema from API...');
    const schemaResponse = await axios.get('http://localhost:4000/api/oracle/schema');
    schema = schemaResponse.data;
    console.log('Schema fetched successfully');
  } catch (error) {
    console.error('Schema API Error - using hardcoded schema instead');
    if (error.response) {
      console.error('Status:', error.response.status);
    } else {
      console.error(error.message);
    }
  }
  
  // Then use the schema for NL to SQL conversion
  console.log('\nSending NL query to generate SQL...');
  try {
    const response = await axios.post('http://localhost:4000/api/llm/generate-sql', {
      prompt: 'Show me all active employees with paid assignments',
      schema: schema
    });
    
    console.log('Generated SQL:');
    console.log(response.data.sql);
    
    // Write the SQL to a file for easier viewing
    const fs = require('fs');
    fs.writeFileSync('generated-sql.txt', response.data.sql, 'utf8');
    console.log('SQL also saved to generated-sql.txt');
  } catch (llmError) {
    console.error('LLM API Error:');
    if (llmError.response) {
      console.error('Status:', llmError.response.status);
      console.error('Data:', JSON.stringify(llmError.response.data, null, 2));
    } else {
      console.error(llmError.message);
    }
    
    // Try direct OpenAI API call to test if that works
    console.log('\nTrying direct OpenAI API call as a test...');
    try {
      const apiKey = process.env.OPENAI_API_KEY;
      if (!apiKey) {
        console.error('OpenAI API key is missing');
        return;
      }
      
      const systemPrompt = `You are an expert Oracle SQL assistant.\nGiven the following HR schema and user request, generate a single valid SQL query.\n\nSchema:\n${JSON.stringify(schema, null, 2)}\n\nUser request: Show me all active employees\n\nRules:\n- Use only the tables and columns provided.\n- Follow business logic: active employee = CURRENT_EMPLOYEE_FLAG = 'Y'; hiring year = PPS_DATE_START; etc.\n- Output only the SQL, no explanation.`;
      
      const openaiResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
        model: 'gpt-3.5-turbo', // Using a simpler model for testing
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: 'Show me all active employees' }
        ],
        temperature: 0,
        max_tokens: 512
      }, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('Direct OpenAI API call successful!');
      console.log('Generated SQL from direct call:');
      console.log(openaiResponse.data.choices[0].message.content);
    } catch (openaiError) {
      console.error('Direct OpenAI API Error:');
      if (openaiError.response) {
        console.error('Status:', openaiError.response.status);
        console.error('Data:', JSON.stringify(openaiError.response.data, null, 2));
      } else {
        console.error(openaiError.message);
      }
    }
  }
}

testNLToSQL();
