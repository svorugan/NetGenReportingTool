import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Box, 
  Alert, 
  Snackbar, 
  Typography, 
  Stack,
  Tabs,
  Tab,
  Paper,
  Button
} from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Header from './Header';
import QueryInput from './QueryInput';
import QueryResults from './QueryResults';
import SchemaViewer from './SchemaViewer';
import ExtraInfoViewer from './ExtraInfoViewer';
// Import ReportsViewer component
import ReportsViewer from './ReportsViewer';
import { oracleService, llmService, reportsService } from '../services/api';

interface MainPageProps {
  onLogout: () => void;
  onBackToHome: () => void;
}

const MainPage: React.FC<MainPageProps> = ({ onLogout, onBackToHome }) => {
  const [schema, setSchema] = useState<any>(null);
  const [isLoadingSchema, setIsLoadingSchema] = useState<boolean>(true);
  const [isGeneratingSql, setIsGeneratingSql] = useState<boolean>(false);
  const [isExecutingQuery, setIsExecutingQuery] = useState<boolean>(false);
  const [generatedSql, setGeneratedSql] = useState<string>('');
  const [editedSql, setEditedSql] = useState<string>('');
  const [queryResults, setQueryResults] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [schemaTabValue, setSchemaTabValue] = useState<number>(0);
  const [mainTabValue, setMainTabValue] = useState<number>(0);
  const [reports, setReports] = useState<any[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ open: boolean; message: string; type: 'success' | 'error' | 'info' }>({
    open: false,
    message: '',
    type: 'info'
  });

  // Fetch schema and reports on component mount
  useEffect(() => {
    fetchSchema();
    fetchReports();
  }, []);

  const fetchSchema = async () => {
    setIsLoadingSchema(true);
    try {
      console.log('Fetching schema from Oracle service...');
      const schemaData = await oracleService.getSchema();
      console.log('Schema data received:', schemaData);
      setSchema(schemaData);
      setNotification({
        open: true,
        message: 'Schema loaded successfully',
        type: 'success'
      });
      return schemaData; // Return the schema data for immediate use
    } catch (err: any) {
      console.error('Error fetching schema:', err);
      setError(`Failed to load schema: ${err.message}`);
      setNotification({
        open: true,
        message: `Failed to load schema: ${err.message}`,
        type: 'error'
      });
      throw err; // Re-throw to handle in calling function
    } finally {
      setIsLoadingSchema(false);
    }
  };

  const handleGenerateSQL = async (prompt: string) => {
    setIsGeneratingSql(true);
    setError(null);
    setGeneratedSql('');
    setQueryResults(null);
    
    try {
      // Get the current schema or fetch a new one
      let currentSchema = schema;
      console.log('Current schema state:', currentSchema);
      
      if (!currentSchema) {
        console.log('Schema not loaded, attempting to fetch it now...');
        try {
          // Fetch schema and store the returned value for immediate use
          currentSchema = await fetchSchema();
          console.log('Schema fetched successfully:', currentSchema);
        } catch (schemaErr) {
          console.error('Failed to fetch schema:', schemaErr);
          throw new Error('Schema not loaded. Please check your Oracle connection.');
        }
      }
      
      if (!currentSchema) {
        throw new Error('Schema is still not available after fetching');
      }
      
      // Now generate SQL with the schema
      console.log('Generating SQL with schema:', currentSchema);
      const response = await llmService.generateSql(prompt, currentSchema);
      console.log('SQL generated successfully:', response);
      setGeneratedSql(response.sql);
      setNotification({
        open: true,
        message: 'SQL generated successfully',
        type: 'success'
      });
    } catch (err: any) {
      console.error('Error generating SQL:', err);
      setError(`Failed to generate SQL: ${err.response?.data?.error || err.message}`);
      setNotification({
        open: true,
        message: `Failed to generate SQL: ${err.response?.data?.error || err.message}`,
        type: 'error'
      });
    } finally {
      setIsGeneratingSql(false);
    }
  };

  const handleExecuteQuery = async () => {
    const sqlToExecute = editedSql || generatedSql;
    if (!sqlToExecute) return;
    
    setIsExecutingQuery(true);
    setError(null);
    setQueryResults(null);
    
    try {
      const response = await oracleService.executeQuery(sqlToExecute);
      setQueryResults(response.rows);
      setNotification({
        open: true,
        message: `Query executed successfully. ${response.rows.length} rows returned.`,
        type: 'success'
      });
    } catch (err: any) {
      console.error('Error executing query:', err);
      setError(`Failed to execute query: ${err.response?.data?.error || err.message}`);
      setNotification({
        open: true,
        message: `Failed to execute query: ${err.response?.data?.error || err.message}`,
        type: 'error'
      });
    } finally {
      setIsExecutingQuery(false);
    }
  };
  
  const handleSqlEdit = (sql: string) => {
    setEditedSql(sql);
    // Pass the edited SQL to the QueryResults component
    if (sql) {
      console.log('SQL edited:', sql);
    }
  };
  
  const fetchReports = async () => {
    setIsLoadingReports(true);
    try {
      const reportsData = await reportsService.getReports();
      setReports(reportsData);
    } catch (err: any) {
      console.error('Error fetching reports:', err);
      setNotification({
        open: true,
        message: `Failed to load reports: ${err.message}`,
        type: 'error'
      });
    } finally {
      setIsLoadingReports(false);
    }
  };
  
  const handleSaveReport = async (name: string, description: string, sql: string) => {
    try {
      await reportsService.saveReport(name, description, sql);
      setNotification({
        open: true,
        message: 'Report saved successfully',
        type: 'success'
      });
      // Refresh reports list
      fetchReports();
    } catch (err: any) {
      console.error('Error saving report:', err);
      setNotification({
        open: true,
        message: `Failed to save report: ${err.message}`,
        type: 'error'
      });
    }
  };
  
  const handleExportCsv = (data: any[]) => {
    try {
      reportsService.exportReportCsv(data);
      setNotification({
        open: true,
        message: 'CSV exported successfully',
        type: 'success'
      });
    } catch (err: any) {
      console.error('Error exporting CSV:', err);
      setNotification({
        open: true,
        message: `Failed to export CSV: ${err.message}`,
        type: 'error'
      });
    }
  };
  
  const handleRunReport = async (sql: string) => {
    setGeneratedSql(sql);
    setEditedSql('');
    setMainTabValue(0); // Switch to query tab
    await handleExecuteQuery();
  };
  
  const handleDeleteReport = async (id: string) => {
    try {
      await reportsService.deleteReport(id);
      setNotification({
        open: true,
        message: 'Report deleted successfully',
        type: 'success'
      });
      // Refresh reports list
      fetchReports();
    } catch (err: any) {
      console.error('Error deleting report:', err);
      setNotification({
        open: true,
        message: `Failed to delete report: ${err.message}`,
        type: 'error'
      });
    }
  };
  
  const handleScheduleReport = async (reportId: string, schedule: any) => {
    try {
      await reportsService.scheduleReport(reportId, schedule);
      setNotification({
        open: true,
        message: 'Report scheduled successfully',
        type: 'success'
      });
      // Refresh reports list
      fetchReports();
    } catch (err: any) {
      console.error('Error scheduling report:', err);
      setNotification({
        open: true,
        message: `Failed to schedule report: ${err.message}`,
        type: 'error'
      });
    }
  };

  const handleCloseNotification = () => {
    setNotification(prev => ({ ...prev, open: false }));
  };

  const handleSchemaTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setSchemaTabValue(newValue);
  };
  
  const handleMainTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setMainTabValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header onLogout={onLogout}>
        <Button 
          color="inherit" 
          onClick={onBackToHome}
          startIcon={<ArrowBackIcon />}
          sx={{ mr: 2 }}
        >
          Back to Dashboard
        </Button>
      </Header>
      
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {error && !notification.open && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}
        
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={mainTabValue} onChange={handleMainTabChange} aria-label="main tabs">
            <Tab label="Query Builder" />
            <Tab label="Saved Reports" />
          </Tabs>
        </Box>
        
        {mainTabValue === 0 ? (
          <Box sx={{ flexGrow: 1 }}>
            <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
              {/* Left column - Schema viewer and Extra Info */}
              <Box sx={{ width: { xs: '100%', md: '33%' } }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
                  <Tabs value={schemaTabValue} onChange={handleSchemaTabChange} aria-label="schema tabs">
                    <Tab label="Database Schema" />
                    <Tab label="Extra Info Types" />
                  </Tabs>
                </Box>
                
                {schemaTabValue === 0 ? (
                  <SchemaViewer schema={schema} isLoading={isLoadingSchema} />
                ) : (
                  <ExtraInfoViewer />
                )}
              </Box>
              
              {/* Right column - Query input and results */}
              <Box sx={{ width: { xs: '100%', md: '67%' } }}>
                <Stack spacing={3}>
                  <QueryInput 
                    onGenerateSQL={handleGenerateSQL} 
                    isLoading={isGeneratingSql} 
                  />
                  
                  <QueryResults 
                    sql={generatedSql}
                    results={queryResults}
                    error={error}
                    isExecuting={isExecutingQuery}
                    onExecuteQuery={handleExecuteQuery}
                    onSaveReport={handleSaveReport}
                    onExportCsv={handleExportCsv}
                    onSqlEdit={handleSqlEdit}
                  />
                </Stack>
              </Box>
            </Stack>
          </Box>
        ) : (
          <Box sx={{ flexGrow: 1 }}>
            <ReportsViewer 
              reports={reports} 
              isLoading={isLoadingReports} 
              onRunReport={handleRunReport}
              onDeleteReport={handleDeleteReport}
              onScheduleReport={handleScheduleReport}
            />
          </Box>
        )}
      </Container>
      
      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[100] }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            NetGen Reporting Tool - Natural Language to SQL Query Generator
          </Typography>
        </Container>
      </Box>
      
      <Snackbar
        open={notification.open}
        autoHideDuration={6000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseNotification} severity={notification.type} sx={{ width: '100%' }}>
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MainPage;
