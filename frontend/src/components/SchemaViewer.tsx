import React, { useState } from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  Chip,
  Paper,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TableChartIcon from '@mui/icons-material/TableChart';

interface SchemaViewerProps {
  schema: any;
  isLoading: boolean;
}

const SchemaViewer: React.FC<SchemaViewerProps> = ({ schema, isLoading }) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  if (isLoading) {
    return (
      <Paper elevation={3} sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (!schema || !schema.tables || schema.tables.length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="body1">No schema information available</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Database Schema
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Explore the HR database tables and columns
      </Typography>

      {schema.tables.map((table: any) => (
        <Accordion 
          key={table.name} 
          expanded={expanded === table.name} 
          onChange={handleChange(table.name)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${table.name}-content`}
            id={`${table.name}-header`}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TableChartIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1">{table.name}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary" paragraph>
              {table.description}
            </Typography>
            
            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
              Columns:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
              {table.columns.map((column: string, index: number) => (
                <Chip 
                  key={index} 
                  label={column} 
                  size="small" 
                  variant="outlined"
                  color={column.includes('(PK)') ? "primary" : column.includes('(FK)') ? "secondary" : "default"}
                />
              ))}
            </Box>
            
            {table.validValues && Object.keys(table.validValues).length > 0 && (
              <>
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
                  Valid Values:
                </Typography>
                <List dense disablePadding>
                  {Object.entries(table.validValues).map(([column, values]: [string, any], index: number) => (
                    <React.Fragment key={column}>
                      {index > 0 && <Divider component="li" />}
                      <ListItem sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                        <ListItemText 
                          primary={column} 
                          primaryTypographyProps={{ fontWeight: 'bold' }}
                        />
                        <Box sx={{ pl: 2, width: '100%' }}>
                          {Object.entries(values).map(([value, description]: [string, any]) => (
                            <Box key={value} sx={{ display: 'flex', mb: 0.5 }}>
                              <Typography variant="body2" sx={{ fontWeight: 'medium', minWidth: '120px' }}>
                                '{value}'
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {description}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </ListItem>
                    </React.Fragment>
                  ))}
                </List>
              </>
            )}
          </AccordionDetails>
        </Accordion>
      ))}

      {schema.businessRules && schema.businessRules.length > 0 && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle2" gutterBottom>
            Business Rules:
          </Typography>
          <List dense sx={{ bgcolor: 'background.paper', border: '1px solid rgba(0, 0, 0, 0.12)', borderRadius: 1 }}>
            {schema.businessRules.map((rule: string, index: number) => (
              <React.Fragment key={index}>
                {index > 0 && <Divider component="li" />}
                <ListItem>
                  <ListItemText primary={rule} />
                </ListItem>
              </React.Fragment>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
};

export default SchemaViewer;
