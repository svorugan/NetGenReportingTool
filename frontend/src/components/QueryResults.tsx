import React, { useState, useEffect } from 'react';
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
  Alert,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Tooltip
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SaveIcon from '@mui/icons-material/Save';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ScheduleIcon from '@mui/icons-material/Schedule';
import { llmService } from '../services/api';

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
  onSaveReport?: (name: string, description: string, sql: string) => Promise<void>;
  onExportCsv?: (data: any[]) => void;
  onScheduleReport?: (reportId: string, schedule: any) => Promise<void>;
  onSqlEdit?: (sql: string) => void;
}

const QueryResults: React.FC<QueryResultsProps> = ({ 
  sql, 
  results, 
  error,
  isExecuting,
  onExecuteQuery,
  onSaveReport,
  onExportCsv,
  onScheduleReport,
  onSqlEdit
}) => {
  const [tabValue, setTabValue] = useState(0);
  const [copied, setCopied] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedSql, setEditedSql] = useState(sql);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [reportName, setReportName] = useState('');
  const [reportDescription, setReportDescription] = useState('');
  const [suggestedName, setSuggestedName] = useState('');
  const [isSuggestingName, setIsSuggestingName] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);
  
  // Update editedSql when sql prop changes and not in edit mode
  useEffect(() => {
    if (!editMode) {
      setEditedSql(sql);
    }
  }, [sql]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(editMode ? editedSql : sql);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const handleEditToggle = () => {
    if (editMode) {
      // If exiting edit mode, update the SQL to be executed
      setEditMode(false);
    } else {
      setEditMode(true);
    }
  };
  
  const handleSqlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newSql = event.target.value;
    setEditedSql(newSql);
    
    // Notify parent component about SQL change
    if (onSqlEdit) {
      onSqlEdit(newSql);
    }
  };
  
  const handleExecuteQuery = () => {
    // Use the edited SQL if in edit mode
    onExecuteQuery();
  };
  
  const handleOpenSaveDialog = () => {
    setSaveDialogOpen(true);
    suggestReportName();
  };
  
  const handleCloseSaveDialog = () => {
    setSaveDialogOpen(false);
    setReportName('');
    setReportDescription('');
  };
  
  const handleSaveReport = () => {
    if (onSaveReport) {
      onSaveReport(reportName, reportDescription, editMode ? editedSql : sql);
      handleCloseSaveDialog();
    }
  };
  
  const suggestReportName = async () => {
    if (!sql) return;
    
    setIsSuggestingName(true);
    try {
      // Call the LLM service to suggest a name based on the SQL
      const suggestion = await llmService.suggestReportName(editMode ? editedSql : sql);
      setSuggestedName(suggestion);
      setReportName(suggestion);
    } catch (error) {
      console.error('Error suggesting report name:', error);
    } finally {
      setIsSuggestingName(false);
    }
  };
  
  const handleExportCsv = () => {
    if (results && onExportCsv) {
      onExportCsv(results);
    }
  };
  
  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
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
          <Typography variant="h6">{editMode ? 'Edit SQL Query' : 'Generated SQL Query'}</Typography>
          <Box>
            <Tooltip title="Toggle Edit Mode">
              <Button 
                startIcon={<EditIcon />} 
                size="small" 
                onClick={handleEditToggle}
                color={editMode ? "success" : "primary"}
              >
                {editMode ? "Exit Edit" : "Edit SQL"}
              </Button>
            </Tooltip>
            <Tooltip title="Copy to Clipboard">
              <Button 
                startIcon={<ContentCopyIcon />} 
                size="small" 
                onClick={copyToClipboard}
                color={copied ? "success" : "primary"}
              >
                {copied ? "Copied!" : "Copy"}
              </Button>
            </Tooltip>
            <Tooltip title="Execute Query">
              <Button 
                variant="contained" 
                color="primary" 
                startIcon={isExecuting ? <CircularProgress size={20} color="inherit" /> : <PlayArrowIcon />}
                onClick={handleExecuteQuery}
                disabled={isExecuting}
                sx={{ ml: 1 }}
              >
                Execute
              </Button>
            </Tooltip>
            <Tooltip title="More Options">
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={menuOpen ? 'long-menu' : undefined}
                aria-expanded={menuOpen ? 'true' : undefined}
                aria-haspopup="true"
                onClick={handleMenuClick}
              >
                <MoreVertIcon />
              </IconButton>
            </Tooltip>
            <Menu
              id="basic-menu"
              anchorEl={menuAnchorEl}
              open={menuOpen}
              onClose={handleMenuClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              <MenuItem onClick={() => { handleMenuClose(); handleOpenSaveDialog(); }}>
                <SaveIcon fontSize="small" sx={{ mr: 1 }} /> Save as Report
              </MenuItem>
              {results && (
                <MenuItem onClick={() => { handleMenuClose(); handleExportCsv(); }}>
                  <DownloadIcon fontSize="small" sx={{ mr: 1 }} /> Export as CSV
                </MenuItem>
              )}
            </Menu>
          </Box>
        </Box>
        
        {editMode ? (
          <TextField
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            value={editedSql}
            onChange={handleSqlChange}
            sx={{ 
              fontFamily: 'monospace',
              '& .MuiInputBase-input': {
                fontFamily: 'monospace',
              }
            }}
          />
        ) : (
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
        )}
        
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6">Query Results</Typography>
          {results && results.length > 0 && (
            <Box>
              <Tooltip title="Save as Report">
                <Button 
                  startIcon={<SaveIcon />} 
                  size="small" 
                  onClick={handleOpenSaveDialog}
                >
                  Save
                </Button>
              </Tooltip>
              <Tooltip title="Export as CSV">
                <Button 
                  startIcon={<DownloadIcon />} 
                  size="small" 
                  onClick={handleExportCsv}
                  sx={{ ml: 1 }}
                >
                  Export CSV
                </Button>
              </Tooltip>
            </Box>
          )}
        </Box>
        
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
      
      {/* Save Report Dialog */}
      <Dialog open={saveDialogOpen} onClose={handleCloseSaveDialog}>
        <DialogTitle>Save Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Save this query as a report for future use. You can access saved reports from your dashboard.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="name"
            label="Report Name"
            fullWidth
            variant="outlined"
            value={reportName}
            onChange={(e) => setReportName(e.target.value)}
            helperText={isSuggestingName ? "Generating suggestion..." : suggestedName ? `Suggested: ${suggestedName}` : ""}
            sx={{ mt: 2 }}
          />
          <TextField
            margin="dense"
            id="description"
            label="Description (optional)"
            fullWidth
            variant="outlined"
            multiline
            rows={2}
            value={reportDescription}
            onChange={(e) => setReportDescription(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSaveDialog}>Cancel</Button>
          <Button 
            onClick={handleSaveReport} 
            variant="contained" 
            disabled={!reportName.trim() || isSuggestingName}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default QueryResults;
