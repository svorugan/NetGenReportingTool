import React, { useState, useEffect } from 'react';
import { personExtraInfoService } from '../services/api';
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
import InfoIcon from '@mui/icons-material/Info';

const ExtraInfoViewer: React.FC = () => {
  const [extraInfoData, setExtraInfoData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };

  useEffect(() => {
    const fetchExtraInfo = async () => {
      try {
        setIsLoading(true);
        const data = await personExtraInfoService.getSchema();
        console.log('ExtraInfoViewer: Received data:', data);
        setExtraInfoData(data);
      } catch (error) {
        console.error('ExtraInfoViewer: Error fetching extra info schema:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchExtraInfo();
  }, []);

  if (isLoading) {
    return (
      <Paper elevation={3} sx={{ p: 3, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
        <CircularProgress />
      </Paper>
    );
  }

  if (!extraInfoData || !extraInfoData.contextTypes || Object.keys(extraInfoData.contextTypes).length === 0) {
    return (
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="body1">No extra information types available</Typography>
      </Paper>
    );
  }

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Person Extra Information Types
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        These are additional person attributes that can be queried
      </Typography>

      {Object.entries(extraInfoData.contextTypes).map(([infoType, info]: [string, any]) => (
        <Accordion 
          key={infoType} 
          expanded={expanded === infoType} 
          onChange={handleChange(infoType)}
          sx={{ mb: 1 }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${infoType}-content`}
            id={`${infoType}-header`}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <InfoIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="subtitle1">{info.informationType}</Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" sx={{ mt: 1, mb: 1 }}>
              Available Fields:
            </Typography>
            <List dense disablePadding>
              {Object.entries(info.fields).map(([column, fieldName]: [string, any], index: number) => (
                <React.Fragment key={column}>
                  {index > 0 && <Divider component="li" />}
                  <ListItem>
                    <ListItemText 
                      primary={fieldName} 
                      secondary={`Column: ${column}`}
                    />
                  </ListItem>
                </React.Fragment>
              ))}
            </List>
          </AccordionDetails>
        </Accordion>
      ))}
      
      <Box sx={{ mt: 2 }}>
        <Typography variant="body2" color="text.secondary">
          You can ask questions about these fields, such as "Show me employees with their Fischer ID" or 
          "List employees whose visa expires this month"
        </Typography>
      </Box>
    </Paper>
  );
};

export default ExtraInfoViewer;
