import express from 'express';
import oracledb from 'oracledb';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();

// Set Oracle connection options
oracledb.autoCommit = true; // Enable auto-commit for simplicity

// Initialize Oracle client with TNS_ADMIN path if available
try {
  const tnsAdmin = process.env.TNS_ADMIN;
  if (tnsAdmin) {
    process.env.TNS_ADMIN = tnsAdmin; // Ensure TNS_ADMIN is set in the process environment
    console.log(`Using TNS_ADMIN path: ${tnsAdmin}`);
    
    // Try to initialize Oracle client if needed
    try {
      oracledb.initOracleClient({ configDir: tnsAdmin });
      console.log('Oracle Client initialized with TNS_ADMIN configuration');
    } catch (err: any) {
      // If initialization fails, it might be because the client is already initialized
      // or we're in thin mode, which is fine as long as TNS_ADMIN is set
      console.log('Using existing Oracle configuration with TNS_ADMIN');
    }
  } else {
    console.log('TNS_ADMIN environment variable not set');
  }
} catch (err: any) {
  console.error('Error setting up Oracle TNS_ADMIN:', err.message);
}

export const oracleRouter = express.Router();

// Hardcoded schema metadata for LLM prompt and UI
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
        },
        'SEX': {
          'M': 'Male',
          'F': 'Female',
          'X': 'Not specified'
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
    'Active assignment = ASSIGNMENT_STATUS NOT IN (\'Do Not Pay RU (DO NOT PROCESS)\', \'LOA without Pay RU\', \'LOAMA without Pay RU\')',
    'Regular assignment = ASSIGNMENT_STATUS NOT LIKE \'%Leave%\' AND ASSIGNMENT_STATUS NOT LIKE \'%LOA%\'',
    'Paid assignment = ASSIGNMENT_STATUS NOT LIKE \'%without Pay%\' AND ASSIGNMENT_STATUS NOT LIKE \'%w/o Pay%\'',
    'Primary assignment = IS_PRIMARY_ASSIGNMENT = \'Y\''
  ]
};

// GET /schema - returns HR schema metadata
oracleRouter.get('/schema', (req, res) => {
  res.json(HR_SCHEMA);
});

// GET /test-connection - tests Oracle database connection
oracleRouter.get('/test-connection', async (req, res) => {
  let connection;
  try {
    const user = process.env.ORACLE_USER;
    const password = process.env.ORACLE_PASSWORD;
    const connectString = process.env.ORACLE_CONNECTION_STRING;
    
    if (!user || !password || !connectString) {
      return res.status(500).json({ 
        success: false, 
        error: 'Oracle connection configuration is missing',
        missingEnvVars: {
          user: !user,
          password: !password,
          connectString: !connectString
        }
      });
    }
    
    // Connect using TNS name from tnsnames.ora via TNS_ADMIN environment variable
    connection = await oracledb.getConnection({
      user,
      password,
      connectString // This should be the TNS name from your tnsnames.ora file
    });
    
    // Simple query to test connection
    const result = await connection.execute('SELECT 1 FROM DUAL');
    
    res.json({ 
      success: true, 
      message: 'Successfully connected to Oracle database',
      result: result.rows
    });
  } catch (err: any) {
    res.status(500).json({ 
      success: false, 
      error: err.message || 'Unknown error occurred',
      errorCode: err.errorNum || null
    });
  } finally {
    if (connection) try { await connection.close(); } catch {}
  }
});

// POST /execute - executes an approved SQL query
oracleRouter.post('/execute', async (req, res) => {
  const { sql, binds } = req.body;
  if (!sql) return res.status(400).json({ error: 'SQL is required' });
  let connection;
  try {
    console.log('Executing SQL query:', sql);
    
    const user = process.env.ORACLE_USER;
    const password = process.env.ORACLE_PASSWORD;
    const connectString = process.env.ORACLE_CONNECTION_STRING;
    
    if (!user || !password || !connectString) {
      console.error('Oracle connection configuration is missing');
      return res.status(500).json({ 
        error: 'Oracle connection configuration is missing',
        missingEnvVars: {
          user: !user,
          password: !password,
          connectString: !connectString
        }
      });
    }
    
    // Connect using TNS name from tnsnames.ora via TNS_ADMIN environment variable
    try {
      console.log('Attempting to connect to Oracle with:', { user, connectString });
      connection = await oracledb.getConnection({
        user,
        password,
        connectString // This should be the TNS name from your tnsnames.ora file
      });
      console.log('Oracle connection established successfully');
    } catch (connErr: any) {
      console.error('Oracle connection error:', connErr.message);
      if (connErr.errorNum) {
        console.error('Oracle error number:', connErr.errorNum);
      }
      return res.status(500).json({ 
        error: 'Failed to connect to Oracle database', 
        details: connErr.message,
        errorNum: connErr.errorNum || null
      });
    }
    
    try {
      console.log('Executing SQL query on Oracle connection');
      const result = await connection.execute(sql, binds || [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
      console.log('Query executed successfully');
      res.json({ rows: result.rows, metaData: result.metaData });
    } catch (queryErr: any) {
      console.error('Query execution error:', queryErr.message);
      return res.status(500).json({ 
        error: 'SQL query execution failed', 
        details: queryErr.message,
        errorNum: queryErr.errorNum || null,
        sql: sql
      });
    }
  } catch (err: any) {
    console.error('Unexpected error in execute endpoint:', err);
    res.status(500).json({ 
      error: 'Unexpected error occurred', 
      details: err.message || 'Unknown error'
    });
  } finally {
    if (connection) {
      try { 
        await connection.close(); 
        console.log('Oracle connection closed');
      } catch (closeErr) {
        console.error('Error closing Oracle connection:', closeErr);
      }
    }
  }
});
