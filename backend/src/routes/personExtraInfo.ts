import express from 'express';
import { personExtraInfoMapping } from '../mappings/personExtraInfoMapping';

export const personExtraInfoRouter = express.Router();

/**
 * @route GET /api/person-extra-info/mapping
 * @desc Get mapping of user-friendly field names to their database location
 * @access Public
 */
personExtraInfoRouter.get('/mapping', (req, res) => {
  res.json(personExtraInfoMapping);
});

/**
 * @route GET /api/person-extra-info/schema
 * @desc Get schema information about person extra info for LLM prompts
 * @access Public
 */
personExtraInfoRouter.get('/schema', (req, res) => {
  // Group fields by information_type for better organization
  const groupedByContext: Record<string, { informationType: string, fields: Record<string, string> }> = {};
  
  // Map of information_type to user-friendly display names
  const informationTypeDisplayNames: Record<string, string> = {
    'PER_US_PASSPORT_DETAILS': 'Passport Details',
    'RUHR_FISCHER': 'RUHR FISCHER',
    'RUHR_PDA_APPLICATION_ROLE': 'Postdoc Alumni Application User Role',
    'RUHR_EXCLUDE_USER': 'RUHR Exclude User',
    'RUHR_ICIMS': 'RUHR iCIMS Details',
    'RUHR_VISA': 'Rockefeller Visas',
    'US_ETHNIC_ORIGIN': 'US Ethnic Origin',
    'VETS 100A': 'VETS 100A',
    'PER_US_VISA_DETAILS': 'Visa Details'
  };
  
  Object.entries(personExtraInfoMapping).forEach(([fieldName, info]) => {
    if (!groupedByContext[info.information_type]) {
      // Use the display name from the map or the raw information_type if not found
      const informationType = informationTypeDisplayNames[info.information_type] || info.information_type;
      groupedByContext[info.information_type] = {
        informationType,
        fields: {}
      };
    }
    
    groupedByContext[info.information_type].fields[info.column] = fieldName;
  });
  
  res.json({
    tableName: 'PER_PEOPLE_EXTRA_INFO',
    description: 'Stores additional person information in a flexible schema',
    joinColumn: 'PERSON_ID',
    contextTypes: groupedByContext
  });
});
