// Mock data for testing reports functionality

export const MOCK_REPORTS = [
  {
    id: '1',
    name: 'Employee Passport Details',
    description: 'Lists all employees with passport information',
    sql: 'SELECT p.person_id, p.first_name, p.last_name, pei.pei_information1 AS passport_number, pei.pei_information2 AS issue_date, pei.pei_information3 AS expiry_date FROM per_all_people_f p JOIN per_people_extra_info pei ON p.person_id = pei.person_id WHERE pei.information_type = \'PER_US_PASSPORT_DETAILS\'',
    created_at: '2023-05-15T10:30:00Z',
    schedule: {
      frequency: 'weekly',
      day: '1',
      time: '08:00'
    }
  },
  {
    id: '2',
    name: 'Fischer ID Report',
    description: 'All employees with Fischer IDs',
    sql: 'SELECT p.person_id, p.first_name, p.last_name, pei.pei_information1 AS fischer_id FROM per_all_people_f p JOIN per_people_extra_info pei ON p.person_id = pei.person_id WHERE pei.information_type = \'RUHR_FISCHER\'',
    created_at: '2023-06-20T14:45:00Z',
    schedule: null
  },
  {
    id: '3',
    name: 'New Hires This Month',
    description: 'Employees hired in the current month',
    sql: 'SELECT person_id, first_name, last_name, hire_date FROM per_all_people_f WHERE EXTRACT(MONTH FROM hire_date) = EXTRACT(MONTH FROM SYSDATE) AND EXTRACT(YEAR FROM hire_date) = EXTRACT(YEAR FROM SYSDATE)',
    created_at: '2023-07-01T09:15:00Z',
    schedule: {
      frequency: 'monthly',
      day: '1',
      time: '09:00'
    }
  }
];
