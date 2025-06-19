import React, { useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Button, 
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Tab,
  Divider,
  Alert
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
      style={{ maxHeight: '400px', overflow: 'auto' }}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

interface QueryResultsProps {
  sql: string;
  results: any[] | null;
  error: string | null;
  isExecuting: boolean;
  onExecuteQuery: () => Promise<void>;
}

const QueryResults: React.FC<QueryResultsProps> = ({ 
  sql, 
  results, 
  error,
  isExecuting,
  onExecuteQuery
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [copied, setCopied] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!sql) {
    return null;
  }

  return (
    <Paper elevation={3} sx={{ p: 0 }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="query results tabs">
          <Tab label="Generated SQL" />
          <Tab label="Results" disabled={!results} />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Generated SQL Query</Typography>
          <Box>
            <Button 
              startIcon={<ContentCopyIcon />} 
              size="small" 
              onClick={copyToClipboard}
              color={copied ? "success" : "primary"}
            >
              {copied ? "Copied!" : "Copy"}
            </Button>
            <Button 
              variant="contained" 
              color="primary" 
              startIcon={isExecuting ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
              onClick={onExecuteQuery}
              disabled={isExecuting}
              sx={{ ml: 1 }}
            >
              Execute
            </Button>
          </Box>
        </Box>
        
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2, 
            backgroundColor: 'rgba(0, 0, 0, 0.04)', 
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            overflowX: 'auto'
          }}
        >
          {sql}
        </Paper>
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Typography variant="h6" gutterBottom>Query Results</Typography>
        
        {results && results.length > 0 ? (
          <TableContainer component={Paper} elevation={0}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  {Object.keys(results[0]).map((key) => (
                    <TableCell key={key}><strong>{key}</strong></TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {results.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Object.values(row).map((value: any, cellIndex) => (
                      <TableCell key={cellIndex}>
                        {value === null ? 'NULL' : String(value)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <Typography color="text.secondary">No results to display</Typography>
        )}
      </TabPanel>
    </Paper>
  );
};

export default QueryResults;
