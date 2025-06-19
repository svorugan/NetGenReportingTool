import express from 'express';
import oracledb from 'oracledb';
import dotenv from 'dotenv';
dotenv.config();

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

// GET /schema - returns HR schema metadata
oracleRouter.get('/schema', (req, res) => {
  res.json(HR_SCHEMA);
});

// POST /execute - executes an approved SQL query
oracleRouter.post('/execute', async (req, res) => {
  const { sql, binds } = req.body;
  if (!sql) return res.status(400).json({ error: 'SQL is required' });
  let connection;
  try {
    connection = await oracledb.getConnection({
      user: process.env.ORACLE_USER,
      password: process.env.ORACLE_PASSWORD,
      connectString: process.env.ORACLE_CONNECTION_STRING
    });
    const result = await connection.execute(sql, binds || [], { outFormat: oracledb.OUT_FORMAT_OBJECT });
    res.json({ rows: result.rows, metaData: result.metaData });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } finally {
    if (connection) try { await connection.close(); } catch {}
  }
});
