require('dotenv').config();
const axios = require('axios');
const fs = require('fs');

// Get the schema from a local file to avoid API call
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
      ],
      validValues: {
        'CURRENT_EMPLOYEE_FLAG': {
          'Y': 'Active employee',
          'N': 'Inactive employee'
        }
      }
    },
    {
      name: 'PER_ASSIGNMENTS_AI_V',
      description: 'Stores current (as of sysdate) assignment information for employees, including job, organization, and payroll details.',
      columns: [
        'PERSON_ID (FK)', 'ASSIGNMENT_ID (PK)', 'JOB_NAME', 'ORGANIZATION_NAME', 'POSITION_NAME',
        'PAYROLL_NAME', 'ASSIGNMENT_STATUS', 'ASSIGNMENT_TYPE', 'GRADE', 'EMPLOYMENT_TYPE', 'IS_PRIMARY_ASSIGNMENT'
      ],
      validValues: {
        'ASSIGNMENT_STATUS': {
          'Do Not Pay RU (DO NOT PROCESS)': 'Do not process payment',
          'FMLA Leave': 'Family and Medical Leave Act leave',
          'FMLA Paid Leave': 'Paid Family and Medical Leave Act leave',
          'FMLA with Shift Differential': 'FMLA leave with shift differential pay',
          'FMLA without Shift Differential': 'FMLA leave without shift differential pay',
          'FMLA/Paid Parental Leave': 'Combined FMLA and paid parental leave',
          'LOA w/o Pay RU (Visa Issue Continue Benefits)': 'Leave of absence without pay due to visa issues',
          'LOA with Pay': 'Leave of absence with pay',
          'LOA without Pay RU': 'Leave of absence without pay',
          'LOAMA with Pay RU': 'Leave of absence for military activity with pay',
          'LOAMA without Pay RU': 'Leave of absence for military activity without pay',
          'Lump Sum Payment': 'One-time lump sum payment',
          'Military Leave with Pay': 'Military leave with continued pay',
          'NY Paid Family Leave': 'New York state paid family leave',
          'Non Payroll Payment': 'Payment outside of regular payroll',
          'Paid Parental Leave': 'Leave for new parents with pay',
          'Pending Red Carpet': 'New hire pending onboarding',
          'STD Leave 100%': 'Short-term disability leave at 100% pay',
          'STD Leave 60%': 'Short-term disability leave at 60% pay',
          'STD Leave State Rate': 'Short-term disability leave at state-mandated rate',
          'STD Waiting Period': 'Waiting period before short-term disability begins',
          'Sabbatical Leave with Pay': 'Extended sabbatical leave with pay',
          'Suspended with Pay': 'Employee suspended but still receiving pay',
          'Temporary Supplemental Pay for Increased Duties': 'Additional pay for temporary duties',
          'Workers Compensation 100%': 'Workers compensation at 100% pay',
          'Workers Compensation 60%': 'Workers compensation at 60% pay',
          'Workers Compensation Rate Only': 'Workers compensation at statutory rate only',
          'iCIMS New Hire': 'New hire in onboarding system'
        },
        'IS_PRIMARY_ASSIGNMENT': {
          'Y': 'Primary assignment',
          'N': 'Secondary assignment'
        }
      }
    }
  ],
  businessRules: [
    'Active employee = CURRENT_EMPLOYEE_FLAG = \'Y\'',
    'Hiring year = extract(year from PPS_DATE_START)',
    'Active assignment = ASSIGNMENT_STATUS NOT IN (\'Do Not Pay RU (DO NOT PROCESS)\', \'LOA without Pay RU\', \'LOAMA without Pay RU\')',
    'Regular assignment = ASSIGNMENT_STATUS NOT LIKE \'%Leave%\' AND ASSIGNMENT_STATUS NOT LIKE \'%LOA%\'',
    'Paid assignment = ASSIGNMENT_STATUS NOT LIKE \'%without Pay%\' AND ASSIGNMENT_STATUS NOT LIKE \'%w/o Pay%\'',
    'Primary assignment = IS_PRIMARY_ASSIGNMENT = \'Y\''
  ]
};

async function testOpenAIDirectly() {
  const prompt = 'Show me all active employees with paid assignments';
  
  const systemPrompt = `You are an expert Oracle SQL assistant.
Given the following HR schema and user request, generate a single valid SQL query.

Schema:
${JSON.stringify(HR_SCHEMA, null, 2)}

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

  try {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OpenAI API key is missing in .env file');
      return;
    }

    console.log('Sending request to OpenAI API...');
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: 'gpt-3.5-turbo',
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
    console.log('\nGenerated SQL:');
    console.log('----------------------------------------');
    console.log(sql);
    console.log('----------------------------------------');
    
    // Save to file for easier viewing
    fs.writeFileSync('generated-sql.txt', sql, 'utf8');
    console.log('SQL saved to generated-sql.txt');
    
  } catch (error) {
    console.error('Error:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', JSON.stringify(error.response.data, null, 2));
    } else {
      console.error(error.message);
    }
  }
}

testOpenAIDirectly();
