/**
 * Type definition for person extra info field mapping
 */
type ExtraInfoField = {
  information_type: string;
  column: string;
  description: string;
};

/**
 * Type definition for the complete mapping object
 */
type PersonExtraInfoMapping = {
  [fieldName: string]: ExtraInfoField;
};

/**
 * Mapping of user-friendly field names to their corresponding information_type and column in PER_PEOPLE_EXTRA_INFO table.
 * This mapping is used by the LLM to generate SQL queries that join with the extra information table.
 */
export const personExtraInfoMapping: PersonExtraInfoMapping = {
  // Passport Details
  "Passport Country": {
    information_type: "PER_US_PASSPORT_DETAILS",
    column: "pei_information5",
    description: "Country that issued the passport"
  },
  "Passport Number": {
    information_type: "PER_US_PASSPORT_DETAILS",
    column: "pei_information6",
    description: "Passport identification number"
  },
  "Passport Issue Date": {
    information_type: "PER_US_PASSPORT_DETAILS",
    column: "pei_information7",
    description: "Date when the passport was issued"
  },
  "Passport Expire Date": {
    information_type: "PER_US_PASSPORT_DETAILS",
    column: "pei_information8",
    description: "Date when the passport expires"
  },
  
  // RUHR FISCHER
  "RUNet Username": {
    information_type: "RUHR_FISCHER",
    column: "pei_information1",
    description: "RUNet username for the employee"
  },
  "Fischer ID": {
    information_type: "RUHR_FISCHER",
    column: "pei_information2",
    description: "Fischer identification number"
  },
  "Personal Email": {
    information_type: "RUHR_FISCHER",
    column: "pei_information3",
    description: "Employee's personal email address"
  },
  "Termination Processed": {
    information_type: "RUHR_FISCHER",
    column: "pei_information4",
    description: "Whether termination has been processed"
  },
  "LDAP ID": {
    information_type: "RUHR_FISCHER",
    column: "pei_information5",
    description: "LDAP identification number"
  },
  "Emergency Termination": {
    information_type: "RUHR_FISCHER",
    column: "pei_information6",
    description: "Whether this is an emergency termination"
  },
  "Override Lastname": {
    information_type: "RUHR_FISCHER",
    column: "pei_information7",
    description: "Override for employee's last name"
  },
  "Override Firstname": {
    information_type: "RUHR_FISCHER",
    column: "pei_information8",
    description: "Override for employee's first name"
  },
  "Legacy Trident UserID": {
    information_type: "RUHR_FISCHER",
    column: "pei_information9",
    description: "Legacy Trident user identification"
  },
  "Huron Transfer Type": {
    information_type: "RUHR_FISCHER",
    column: "pei_information10",
    description: "Type of Huron transfer"
  },
  "License Type": {
    information_type: "RUHR_FISCHER",
    column: "pei_information11",
    description: "Type of license"
  },
  "License Eligible": {
    information_type: "RUHR_FISCHER",
    column: "pei_information12",
    description: "Whether eligible for license"
  },
  
  // Postdoc Alumni Application User Role
  "Send to Postdoc as": {
    information_type: "RUHR_PDA_APPLICATION_ROLE",
    column: "pei_information2",
    description: "How to send to postdoc"
  },
  
  // RUHR Exclude User
  "RUHR End-Date User Exception": {
    information_type: "RUHR_EXCLUDE_USER",
    column: "pei_information2",
    description: "Exception for RUHR end-date user"
  },
  
  // RUHR iCIMS Details
  "iCIMS System ID": {
    information_type: "RUHR_ICIMS",
    column: "pei_information1",
    description: "iCIMS System ID for the employee"
  },
  "iCIMS Applicant Workflow ID": {
    information_type: "RUHR_ICIMS",
    column: "pei_information2",
    description: "iCIMS Applicant Workflow ID for the employee"
  },
  
  // Rockefeller Visas
  "Visa": {
    information_type: "RUHR_VISA",
    column: "pei_information1",
    description: "Employee's visa type"
  },
  "Visa Effective Date": {
    information_type: "RUHR_VISA",
    column: "pei_information2",
    description: "Date when the visa became effective"
  },
  "Visa Entry Date": {
    information_type: "RUHR_VISA",
    column: "pei_information3",
    description: "Date of entry with the visa"
  },
  "Visa Expiration Date": {
    information_type: "RUHR_VISA",
    column: "pei_information4",
    description: "Date when the visa expires"
  },
  "Previous Visa": {
    information_type: "RUHR_VISA",
    column: "pei_information5",
    description: "Employee's previous visa type"
  },
  "Previous Visa Effective Date": {
    information_type: "RUHR_VISA",
    column: "pei_information6",
    description: "Date when the previous visa became effective"
  },
  "Previous Visa Expiration Date": {
    information_type: "RUHR_VISA",
    column: "pei_information7",
    description: "Date when the previous visa expired"
  },
  
  // US Ethnic Origin
  "Hispanic": {
    information_type: "US_ETHNIC_ORIGIN",
    column: "pei_information1",
    description: "Whether the employee identifies as Hispanic"
  },
  "American Indian Alaskan Native": {
    information_type: "US_ETHNIC_ORIGIN",
    column: "pei_information2",
    description: "Whether the employee identifies as American Indian or Alaskan Native"
  },
  "Asian": {
    information_type: "US_ETHNIC_ORIGIN",
    column: "pei_information3",
    description: "Whether the employee identifies as Asian"
  },
  "Black or African American": {
    information_type: "US_ETHNIC_ORIGIN",
    column: "pei_information4",
    description: "Whether the employee identifies as Black or African American"
  },
  "Native Hawaiian or Other Pacific Islander": {
    information_type: "US_ETHNIC_ORIGIN",
    column: "pei_information5",
    description: "Whether the employee identifies as Native Hawaiian or Other Pacific Islander"
  },
  "White": {
    information_type: "US_ETHNIC_ORIGIN",
    column: "pei_information6",
    description: "Whether the employee identifies as White"
  },
  "Two or More Races": {
    information_type: "US_ETHNIC_ORIGIN",
    column: "pei_information7",
    description: "Whether the employee identifies as Two or More Races"
  },
  
  // VETS 100A
  "Military Discharge Date": {
    information_type: "VETS 100A",
    column: "pei_information1",
    description: "Date of discharge from military service"
  },
  
  // Visa Details (PER_US_VISA_DETAILS)
  "Visa Type": {
    information_type: "PER_US_VISA_DETAILS",
    column: "pei_information5",
    description: "Type of visa"
  },
  "Visa Number": {
    information_type: "PER_US_VISA_DETAILS",
    column: "pei_information6",
    description: "Visa identification number"
  },
  "Visa Issue Date": {
    information_type: "PER_US_VISA_DETAILS",
    column: "pei_information7",
    description: "Date when the visa was issued"
  },
  "Visa Expiry Date": {
    information_type: "PER_US_VISA_DETAILS",
    column: "pei_information8",
    description: "Date when the visa expires"
  },
  "Visa Category": {
    information_type: "PER_US_VISA_DETAILS",
    column: "pei_information9",
    description: "Category of the visa"
  },
  "Current Visa": {
    information_type: "PER_US_VISA_DETAILS",
    column: "pei_information10",
    description: "Whether this is the current visa"
  }
};

/**
 * Helper function to get SQL join conditions for a specific user-friendly field name
 */
export function getSqlJoinForField(fieldName: string): { 
  informationType: string; 
  column: string;
  joinClause: string;
  selectClause: string;
} | null {
  const mapping = personExtraInfoMapping[fieldName as keyof typeof personExtraInfoMapping];
  if (!mapping) return null;
  
  return {
    informationType: mapping.information_type,
    column: mapping.column,
    joinClause: `JOIN PER_PEOPLE_EXTRA_INFO pei_${mapping.column} ON p.PERSON_ID = pei_${mapping.column}.PERSON_ID AND pei_${mapping.column}.information_type = '${mapping.information_type}'`,
    selectClause: `pei_${mapping.column}.${mapping.column} AS "${fieldName}"`
  };
}
