import axios from 'axios';
import { MOCK_REPORTS } from './mockData';

// Import HR_SCHEMA directly from the mock data
const HR_SCHEMA = {
  tables: [
    {
      name: 'PER_PEOPLE_EXTRA_INFO',
      description: 'Stores additional person information in a flexible schema with context-specific fields.',
      columns: [
        'PERSON_ID (FK)', 'INFORMATION_TYPE', 'PEI_INFORMATION1', 'PEI_INFORMATION2', 'PEI_INFORMATION3',
        'PEI_INFORMATION4', 'PEI_INFORMATION5', 'PEI_INFORMATION6', 'PEI_INFORMATION7', 'PEI_INFORMATION8',
        'PEI_INFORMATION9', 'PEI_INFORMATION10', 'PEI_INFORMATION11', 'PEI_INFORMATION12', 'PEI_INFORMATION13',
        'PEI_INFORMATION14', 'PEI_INFORMATION15'
      ],
      informationTypes: {
        'PER_US_PASSPORT_DETAILS': 'Passport Details',
        'RUHR_FISCHER': 'RUHR FISCHER'
      }
    }
  ]
};

// Create an axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Mock schema for testing when Oracle connection fails
const MOCK_SCHEMA = {
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
        },
        'SEX': {
          'M': 'Male',
          'F': 'Female',
          'X': 'Not specified'
        }
      }
    },
    {
      name: 'PER_PEOPLE_EXTRA_INFO',
      description: 'Stores additional person information in a flexible schema with context-specific fields.',
      columns: [
        'PERSON_ID (FK)', 'INFORMATION_TYPE', 'PEI_INFORMATION1', 'PEI_INFORMATION2', 'PEI_INFORMATION3',
        'PEI_INFORMATION4', 'PEI_INFORMATION5', 'PEI_INFORMATION6', 'PEI_INFORMATION7', 'PEI_INFORMATION8',
        'PEI_INFORMATION9', 'PEI_INFORMATION10', 'PEI_INFORMATION11', 'PEI_INFORMATION12', 'PEI_INFORMATION13',
        'PEI_INFORMATION14', 'PEI_INFORMATION15'
      ],
      relationships: [
        { table: 'PER_PEOPLE_AI_V', localColumn: 'PERSON_ID', foreignColumn: 'PERSON_ID' }
      ],
      informationTypes: {
        'PER_US_PASSPORT_DETAILS': 'Passport Details',
        'RUHR_FISCHER': 'RUHR FISCHER',
        'RUHR_PDA_APPLICATION_ROLE': 'Postdoc Alumni Application User Role',
        'RUHR_EXCLUDE_USER': 'RUHR Exclude User',
        'RUHR_ICIMS': 'RUHR iCIMS Details',
        'RUHR_VISA': 'Rockefeller Visas',
        'US_ETHNIC_ORIGIN': 'US Ethnic Origin',
        'VETS 100A': 'VETS 100A',
        'PER_US_VISA_DETAILS': 'Visa Details'
      }
    },
    {
      name: 'PER_ASSIGNMENTS_AI_V',
      description: 'Stores current (as of sysdate) assignment information for employees, including job, organization, and payroll details.',
      columns: [
        'PERSON_ID (FK)', 'ASSIGNMENT_ID (PK)', 'JOB_NAME', 'ORGANIZATION_NAME', 'POSITION_NAME',
        'PAYROLL_NAME', 'ASSIGNMENT_STATUS', 'ASSIGNMENT_TYPE', 'GRADE', 'EMPLOYMENT_TYPE', 'IS_PRIMARY_ASSIGNMENT'
      ],
      columnDescriptions: {
        'PERSON_ID': 'Foreign key linking to PER_PEOPLE_AI_V.PERSON_ID, identifies the employee',
        'ASSIGNMENT_ID': 'Primary key for the assignment record',
        'JOB_NAME': 'Name of the job position',
        'ORGANIZATION_NAME': 'Department or organization name the employee belongs to',
        'POSITION_NAME': 'Specific position title within the job',
        'PAYROLL_NAME': 'Payroll group the employee belongs to',
        'ASSIGNMENT_STATUS': 'Current status of the assignment (active, leave, etc.)',
        'ASSIGNMENT_TYPE': 'Type of assignment',
        'GRADE': 'Pay grade or level',
        'EMPLOYMENT_TYPE': 'Employment category (full-time, part-time, etc.)',
        'IS_PRIMARY_ASSIGNMENT': 'Indicates if this is the employee\'s primary assignment (Y) or secondary (N)'
      },
      relationships: [
        { table: 'PER_PEOPLE_AI_V', localColumn: 'PERSON_ID', foreignColumn: 'PERSON_ID' }
      ],
      validValues: {
        'ASSIGNMENT_STATUS': {
          'Do Not Pay RU (DO NOT PROCESS)': 'Do not process payment',
          'FMLA Leave': 'Family and Medical Leave Act leave',
          'FMLA Paid Leave': 'Paid Family and Medical Leave Act leave',
          'LOA with Pay': 'Leave of absence with pay',
          'LOA without Pay RU': 'Leave of absence without pay',
          'Active': 'Active assignment'
        },
        'EMPLOYMENT_TYPE': {
          'FULL_TIME': 'Full-time employee',
          'PART_TIME': 'Part-time employee',
          'CONTRACT': 'Contract worker',
          'TEMPORARY': 'Temporary worker'
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
    'Active assignment = ASSIGNMENT_STATUS = \'Active\'',
    'Primary assignment = IS_PRIMARY_ASSIGNMENT = \'Y\''
  ]
};

// Person Extra Info API services
export const personExtraInfoService = {
  // Get the person extra info schema
  getSchema: async () => {
    try {
      console.log('API: Requesting person extra info schema...');
      const response = await api.get('person-extra-info/schema');
      console.log('API: Person extra info schema received:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: Error fetching person extra info schema:', error);
      throw error;
    }
  }
};

// Oracle API services
export const oracleService = {
  // Test the Oracle database connection
  testConnection: async () => {
    try {
      console.log('API: Testing Oracle connection...');
      const response = await api.get('oracle/test-connection');
      console.log('API: Connection test successful:', response.data);
      return response.data;
    } catch (error) {
      console.error('API: Error testing connection:', error);
      throw error;
    }
  },
  
  // Get the Oracle schema metadata
  getSchema: async () => {
    try {
      console.log('API: Requesting schema from backend...');
      // Try to get schema from backend
      const response = await api.get('oracle/schema');
      console.log('API: Schema received from backend:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('API: Error fetching schema from backend:', error);
      console.log('API: Using mock schema instead');
      
      // Return the mock schema instead of throwing an error
      return MOCK_SCHEMA;
    }
  },
  
  // Execute an SQL query
  executeQuery: async (sql: string) => {
    try {
      console.log('API: Executing SQL query:', sql);
      
      // Clean the SQL query by removing markdown formatting and trailing semicolons
      const cleanSql = sql
        .replace(/```sql\n/g, '') // Remove opening ```sql
        .replace(/```/g, '')       // Remove closing ```
        .replace(/;\s*$/g, '')    // Remove trailing semicolons
        .trim();                   // Remove extra whitespace
      
      console.log('API: Cleaned SQL query:', cleanSql);
      console.log('API: Full URL being called:', api.defaults.baseURL + '/oracle/execute');
      
      try {
        // Try to execute on the backend
        const response = await api.post('oracle/execute', { sql: cleanSql });
        console.log('API: Real database query successful:', response.data);
        return response.data;
      } catch (backendError: any) {
        console.error('API: Backend query execution failed:', backendError);
        console.log('API: Error details:', backendError.message);
        if (backendError.response) {
          console.log('API: Error response status:', backendError.response.status);
          console.log('API: Error response data:', backendError.response.data);
        } else if (backendError.request) {
          console.log('API: No response received from server');
        }
        
        console.log('API: Using mock query execution as fallback');
        // Generate mock query results
        return generateMockQueryResults(cleanSql);
      }
    } catch (error: any) {
      console.error('Error executing query:', error);
      throw new Error(`Query execution failed: ${error.message}`);
    }
  }
};

// LLM API services
export const llmService = {
  // Generate SQL from natural language
  generateSql: async (prompt: string, schema: any) => {
    try {
      console.log('API: Sending NL prompt and schema to LLM service...');
      if (!schema) {
        console.error('API: Schema is undefined or null');
        throw new Error('Cannot generate SQL: Schema is missing');
      }
      
      try {
        // Try to use the backend LLM service
        const response = await api.post('llm/generate-sql', { prompt, schema });
        console.log('API: SQL generated successfully:', response.data);
        return response.data;
      } catch (backendError: any) {
        console.error('API: Backend LLM service error:', backendError);
        
        // If backend fails, generate a mock SQL response
        console.log('API: Generating mock SQL response');
        const mockSql = generateMockSql(prompt, schema);
        return { sql: mockSql };
      }
    } catch (error: any) {
      console.error('API: Error generating SQL:', error);
      throw new Error(`SQL generation failed: ${error.message}`);
    }
  },
  
  // Suggest a report name based on SQL query
  suggestReportName: async (sql: string): Promise<string> => {
    try {
      console.log('API: Requesting report name suggestion for SQL...');
      const response = await api.post('llm/suggest-report-name', { sql });
      console.log('API: Report name suggestion received:', response.data);
      return response.data.name;
    } catch (error) {
      console.error('API: Error suggesting report name:', error);
      // Generate a simple name based on the SQL
      const defaultName = generateDefaultReportName(sql);
      return defaultName;
    }
  }
};

// Helper function to generate mock SQL based on the prompt and schema
function generateMockSql(prompt: string, schema: any): string {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const tables = schema.tables.map((t: any) => t.name).join(', ');
  const lowercasePrompt = prompt.toLowerCase();
  
  // Generate simple SQL based on keywords in the prompt
  if (lowercasePrompt.includes('count') && (lowercasePrompt.includes('department') || lowercasePrompt.includes('organization'))) {
    // Count employees by department/organization
    return `SELECT a.ORGANIZATION_NAME, COUNT(*) AS employee_count 
FROM PER_PEOPLE_AI_V p 
JOIN PER_ASSIGNMENTS_AI_V a ON p.PERSON_ID = a.PERSON_ID 
WHERE p.CURRENT_EMPLOYEE_FLAG = 'Y' AND a.IS_PRIMARY_ASSIGNMENT = 'Y' 
GROUP BY a.ORGANIZATION_NAME 
ORDER BY a.ORGANIZATION_NAME`;
  } else if (lowercasePrompt.includes('count')) {
    return `SELECT COUNT(*) AS employee_count FROM PER_PEOPLE_AI_V WHERE CURRENT_EMPLOYEE_FLAG = 'Y'`;
  } else if (lowercasePrompt.includes('average') || lowercasePrompt.includes('avg')) {
    return `SELECT AVG(LENGTH(FIRST_NAME)) AS avg_name_length FROM PER_PEOPLE_AI_V`;
  } else if (lowercasePrompt.includes('department') || lowercasePrompt.includes('organization')) {
    // List all departments/organizations
    return `SELECT DISTINCT a.ORGANIZATION_NAME 
FROM PER_ASSIGNMENTS_AI_V a 
ORDER BY a.ORGANIZATION_NAME`;
  } else if (lowercasePrompt.includes('assignment') || lowercasePrompt.includes('job')) {
    return `SELECT p.PERSON_ID, p.FULL_NAME, a.JOB_NAME, a.ORGANIZATION_NAME 
FROM PER_PEOPLE_AI_V p 
JOIN PER_ASSIGNMENTS_AI_V a ON p.PERSON_ID = a.PERSON_ID 
WHERE p.CURRENT_EMPLOYEE_FLAG = 'Y' AND a.IS_PRIMARY_ASSIGNMENT = 'Y'`;
  } else {
    return `SELECT PERSON_ID, FIRST_NAME, LAST_NAME, FULL_NAME 
FROM PER_PEOPLE_AI_V 
WHERE CURRENT_EMPLOYEE_FLAG = 'Y' 
ORDER BY LAST_NAME, FIRST_NAME`;
  }
};

// Helper function to generate mock query results based on the SQL query
function generateMockQueryResults(sql: string): any {
  const lowercaseSql = sql.toLowerCase();
  
  // Mock results for different types of queries
  if (lowercaseSql.includes('count(*)')) {
    return {
      columns: ['EMPLOYEE_COUNT'],
      rows: [{ EMPLOYEE_COUNT: 42 }]
    };
  } else if (lowercaseSql.includes('avg')) {
    return {
      columns: ['AVG_NAME_LENGTH'],
      rows: [{ AVG_NAME_LENGTH: 5.8 }]
    };
  } else if (lowercaseSql.includes('join')) {
    return {
      columns: ['PERSON_ID', 'FULL_NAME', 'JOB_NAME', 'ORGANIZATION_NAME'],
      rows: [
        { PERSON_ID: 101, FULL_NAME: 'John Smith', JOB_NAME: 'Software Engineer', ORGANIZATION_NAME: 'IT Department' },
        { PERSON_ID: 102, FULL_NAME: 'Jane Doe', JOB_NAME: 'Product Manager', ORGANIZATION_NAME: 'Product Development' },
        { PERSON_ID: 103, FULL_NAME: 'Robert Johnson', JOB_NAME: 'Data Analyst', ORGANIZATION_NAME: 'Analytics' },
        { PERSON_ID: 104, FULL_NAME: 'Emily Williams', JOB_NAME: 'UX Designer', ORGANIZATION_NAME: 'Design Team' },
        { PERSON_ID: 105, FULL_NAME: 'Michael Brown', JOB_NAME: 'DevOps Engineer', ORGANIZATION_NAME: 'IT Department' }
      ]
    };
  } else {
    // Default employee list
    return {
      columns: ['PERSON_ID', 'FIRST_NAME', 'LAST_NAME', 'FULL_NAME'],
      rows: [
        { PERSON_ID: 101, FIRST_NAME: 'John', LAST_NAME: 'Smith', FULL_NAME: 'John Smith' },
        { PERSON_ID: 102, FIRST_NAME: 'Jane', LAST_NAME: 'Doe', FULL_NAME: 'Jane Doe' },
        { PERSON_ID: 103, FIRST_NAME: 'Robert', LAST_NAME: 'Johnson', FULL_NAME: 'Robert Johnson' },
        { PERSON_ID: 104, FIRST_NAME: 'Emily', LAST_NAME: 'Williams', FULL_NAME: 'Emily Williams' },
        { PERSON_ID: 105, FIRST_NAME: 'Michael', LAST_NAME: 'Brown', FULL_NAME: 'Michael Brown' },
        { PERSON_ID: 106, FIRST_NAME: 'Sarah', LAST_NAME: 'Davis', FULL_NAME: 'Sarah Davis' },
        { PERSON_ID: 107, FIRST_NAME: 'David', LAST_NAME: 'Miller', FULL_NAME: 'David Miller' },
        { PERSON_ID: 108, FIRST_NAME: 'Jennifer', LAST_NAME: 'Wilson', FULL_NAME: 'Jennifer Wilson' },
        { PERSON_ID: 109, FIRST_NAME: 'James', LAST_NAME: 'Taylor', FULL_NAME: 'James Taylor' },
        { PERSON_ID: 110, FIRST_NAME: 'Lisa', LAST_NAME: 'Anderson', FULL_NAME: 'Lisa Anderson' }
      ]
    };
  }
}

// Reports API services
export const reportsService = {
  // In-memory storage for mock reports
  _reports: [...MOCK_REPORTS],
  
  getReports: async () => {
    // In a real implementation, this would be an API call
    console.log('Fetching reports');
    return reportsService._reports;
  },
  
  saveReport: async (name: string, description: string, sql: string) => {
    // In a real implementation, this would be an API call
    console.log('Saving report:', { name, description, sql });
    
    // Create a new report with a unique ID
    const newReport = {
      id: Date.now().toString(),
      name,
      description,
      sql,
      created_at: new Date().toISOString(),
      schedule: null
    };
    
    // Add to in-memory storage
    reportsService._reports.push(newReport);
    
    return { success: true, report: newReport };
  },
  
  deleteReport: async (id: string) => {
    // In a real implementation, this would be an API call
    console.log('Deleting report:', id);
    
    // Remove from in-memory storage
    reportsService._reports = reportsService._reports.filter(report => report.id !== id);
    
    return { success: true };
  },
  
  scheduleReport: async (id: string, schedule: any) => {
    // In a real implementation, this would be an API call
    console.log('Scheduling report:', { id, schedule });
    
    // Update the report in in-memory storage
    const reportIndex = reportsService._reports.findIndex(report => report.id === id);
    if (reportIndex !== -1) {
      reportsService._reports[reportIndex].schedule = schedule;
    }
    
    return { success: true };
  },
  
  // Export report results as CSV
  exportReportCsv: (data: any[]) => {
    if (!data || data.length === 0) {
      console.error('API: No data to export');
      return;
    }
    
    try {
      // Convert data to CSV
      const headers = Object.keys(data[0]).join(',');
      const rows = data.map(row => Object.values(row).map(value => 
        value === null ? '' : typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value
      ).join(','));
      const csv = [headers, ...rows].join('\n');
      
      // Create download link
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `report_${new Date().toISOString().slice(0,10)}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('API: Error exporting CSV:', error);
      throw error;
    }
  }
};

export const authService = {
  // Login with username and password
  login: async (username: string, password: string) => {
    try {
      console.log('API: Attempting login...');
      const response = await api.post('auth/login', { username, password });
      console.log('API: Login successful');
      
      // Store the token in localStorage
      localStorage.setItem('authToken', response.data.token);
      return response.data;
    } catch (error) {
      console.error('API: Login failed:', error);
      throw error;
    }
  },
  
  // Logout user
  logout: () => {
    console.log('API: Logging out...');
    localStorage.removeItem('authToken');
  },
  
  // Check if user is authenticated
  isAuthenticated: () => {
    return !!localStorage.getItem('authToken');
  }
};

// Helper function to generate a default report name based on SQL
function generateDefaultReportName(sql: string): string {
  const lowercaseSql = sql.toLowerCase();
  let name = 'New Report';
  
  // Try to extract table names
  const fromMatch = lowercaseSql.match(/from\s+(\w+)/i);
  if (fromMatch && fromMatch[1]) {
    const tableName = fromMatch[1].replace(/per_|_ai_v/gi, '').replace(/_/g, ' ');
    name = tableName.charAt(0).toUpperCase() + tableName.slice(1).toLowerCase() + ' Report';
  }
  
  // Check for common query types
  if (lowercaseSql.includes('count(*)')) {
    name = 'Count Report';
  } else if (lowercaseSql.includes('group by')) {
    name = 'Summary Report';
  } else if (lowercaseSql.includes('join')) {
    name = 'Joined Data Report';
  }
  
  return name + ' ' + new Date().toISOString().slice(0,10);
}

export default api;
