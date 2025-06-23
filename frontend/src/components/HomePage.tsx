import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  Button,
  Tooltip,
  CircularProgress,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  Dialog,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import BusinessIcon from '@mui/icons-material/Business';
import PeopleIcon from '@mui/icons-material/People';

import { reportsService } from '../services/api';
import SettingPage from './SettingPage';
import { useNavigate } from 'react-router-dom';

interface HomePageProps {
  onLogout: () => void;
  onCreateNewReport: () => void;
  dataSources: any[];
  setDataSources: (ds: any[]) => void;
  llmModels: any[];
  setLlmModels: (models: any[]) => void;
  apiKeys: any[];
  setApiKeys: (keys: any[]) => void;
  handleDeleteDataSource: (id: string) => void;
  handleDeleteLlmModel: (id: string) => void;
  handleDeleteApiKey: (id: string) => void;
  handleToggleLlmModel: (id: string) => void;
  handleToggleApiKey: (id: string) => void;
  dataSourceDialogOpen: boolean;
  setDataSourceDialogOpen: (open: boolean) => void;
  llmModelDialogOpen: boolean;
  setLlmModelDialogOpen: (open: boolean) => void;
  apiKeyDialogOpen: boolean;
  setApiKeyDialogOpen: (open: boolean) => void;
  newDataSource: any;
  setNewDataSource: (ds: any) => void;
  newLlmModel: any;
  setNewLlmModel: (model: any) => void;
  newApiKey: any;
  setNewApiKey: (key: any) => void;
  handleAddDataSource: () => void;
  handleAddLlmModel: () => void;
  handleAddApiKey: () => void;
}


const HomePage: React.FC<HomePageProps> = ({
  onLogout,
  onCreateNewReport,
  dataSources,
  setDataSources,
  llmModels,
  setLlmModels,
  apiKeys,
  setApiKeys,
  handleDeleteDataSource,
  handleDeleteLlmModel,
  handleDeleteApiKey,
  handleToggleLlmModel,
  handleToggleApiKey,
  dataSourceDialogOpen,
  setDataSourceDialogOpen,
  llmModelDialogOpen,
  setLlmModelDialogOpen,
  apiKeyDialogOpen,
  setApiKeyDialogOpen,
  newDataSource,
  setNewDataSource,
  newLlmModel,
  setNewLlmModel,
  newApiKey,
  setNewApiKey,
  handleAddDataSource,
  handleAddLlmModel,
  handleAddApiKey
}) => {
  const navigate = useNavigate();
  const [reports, setReports] = useState<any[]>([]);
  const [isLoadingReports, setIsLoadingReports] = useState<boolean>(true);
  const [reportFilter, setReportFilter] = useState('all');
  const [displayedReports, setDisplayedReports] = useState<any[]>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [reportStats, setReportStats] = useState({
    total: 0,
    hr: 0,
    finance: 0,
    operations: 0,
    other: 0
  });

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoadingReports(true);
    try {
      const data = await reportsService.getReports();
      setReports(data);
    } catch (error) {
      console.error('Failed to fetch reports:', error);
    } finally {
      setIsLoadingReports(false);
    }
  };

  useEffect(() => {
    // Calculate statistics
    const stats = {
      total: reports.length,
      hr: reports.filter(r => r.name.toLowerCase().includes('employee') || 
                             r.name.toLowerCase().includes('hr') || 
                             r.description.toLowerCase().includes('employee')).length,
      finance: reports.filter(r => r.name.toLowerCase().includes('finance') || 
                                  r.name.toLowerCase().includes('budget') || 
                                  r.description.toLowerCase().includes('finance')).length,
      operations: reports.filter(r => r.name.toLowerCase().includes('operation') || 
                                      r.description.toLowerCase().includes('operation')).length,
      other: 0
    };
    
    stats.other = stats.total - stats.hr - stats.finance - stats.operations;
    setReportStats(stats);
    
    // Filter reports
    if (reportFilter === 'all') {
      setDisplayedReports(reports);
    } else if (reportFilter === 'hr') {
      setDisplayedReports(reports.filter(r => r.name.toLowerCase().includes('employee') || 
                                            r.name.toLowerCase().includes('hr') || 
                                            r.description.toLowerCase().includes('employee')));
    } else if (reportFilter === 'finance') {
      setDisplayedReports(reports.filter(r => r.name.toLowerCase().includes('finance') || 
                                               r.name.toLowerCase().includes('budget') || 
                                               r.description.toLowerCase().includes('finance')));
    } else if (reportFilter === 'operations') {
      setDisplayedReports(reports.filter(r => r.name.toLowerCase().includes('operation') || 
                                               r.description.toLowerCase().includes('operation')));
    } else {
      const filtered = reports.filter(r => 
        !r.name.toLowerCase().includes('employee') && 
        !r.name.toLowerCase().includes('hr') && 
        !r.description.toLowerCase().includes('employee') &&
        !r.name.toLowerCase().includes('finance') && 
        !r.name.toLowerCase().includes('budget') && 
        !r.description.toLowerCase().includes('finance') &&
        !r.name.toLowerCase().includes('operation') && 
        !r.description.toLowerCase().includes('operation')
      );
      setDisplayedReports(filtered);
    }
  }, [reports, reportFilter]);

  const handleRunReport = async (sql: string) => {
    console.log('Running report with SQL:', sql);
  };
  
  // Handle page change
  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  // Handle rows per page change
  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <>
      <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" component="h1">
            NetGen Reporting Dashboard
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              startIcon={<AddIcon />}
              onClick={onCreateNewReport}
            >
              Create New Report
            </Button>
            <IconButton onClick={() => navigate('/settings')} color="inherit" title="Settings">
              <SettingsIcon />
            </IconButton>
            <IconButton onClick={onLogout} color="inherit" title="Logout">
              <LogoutIcon />
            </IconButton>
          </Box>
        </Box>

        <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            {/* Report Statistics */}
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" component="h2">
                  <AssessmentIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Report Statistics
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 3 }}>
                <Paper elevation={1} sx={{ p: 2, flex: '1 1 auto', minWidth: '120px', bgcolor: 'primary.light', color: 'white' }}>
                  <Typography variant="h6">{reportStats.total}</Typography>
                  <Typography variant="body2">Total Reports</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, flex: '1 1 auto', minWidth: '120px', bgcolor: 'success.light', color: 'white' }}>
                  <Typography variant="h6">{reportStats.hr}</Typography>
                  <Typography variant="body2">HR Reports</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, flex: '1 1 auto', minWidth: '120px', bgcolor: 'info.light', color: 'white' }}>
                  <Typography variant="h6">{reportStats.finance}</Typography>
                  <Typography variant="body2">Finance Reports</Typography>
                </Paper>
                <Paper elevation={1} sx={{ p: 2, flex: '1 1 auto', minWidth: '120px', bgcolor: 'warning.light', color: 'white' }}>
                  <Typography variant="h6">{reportStats.operations}</Typography>
                  <Typography variant="body2">Operations Reports</Typography>
                </Paper>
              </Box>
            </Paper>

            {/* Report Filters */}
            <Box sx={{ display: 'flex', mb: 3 }}>
              <ToggleButtonGroup
                value={reportFilter}
                exclusive
                onChange={(e, newFilter) => newFilter && setReportFilter(newFilter)}
                size="small"
              >
                <ToggleButton value="all">All</ToggleButton>
                <ToggleButton value="hr">HR</ToggleButton>
                <ToggleButton value="finance">Finance</ToggleButton>
                <ToggleButton value="operations">Operations</ToggleButton>
                <ToggleButton value="other">Other</ToggleButton>
              </ToggleButtonGroup>
            </Box>

            {/* Reports */}
            {isLoadingReports ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
              </Box>
            ) : displayedReports.length > 0 ? (
              <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                  <Table stickyHeader aria-label="reports table">
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Created</TableCell>
                        <TableCell align="right">Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {displayedReports
                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                        .map((report) => (
                          <TableRow key={report.id} hover>
                            <TableCell component="th" scope="row">
                              {report.name}
                            </TableCell>
                            <TableCell>{report.description || 'No description'}</TableCell>
                            <TableCell>
                              {report.created_at ? new Date(report.created_at).toLocaleDateString() : 'N/A'}
                            </TableCell>
                            <TableCell align="right">
                              <Tooltip title="Run Report">
                                <IconButton 
                                  size="small" 
                                  color="primary"
                                  onClick={() => handleRunReport(report.sql)}
                                >
                                  <PlayArrowIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Schedule">
                                <IconButton size="small">
                                  <ScheduleIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Edit">
                                <IconButton size="small">
                                  <EditIcon />
                                </IconButton>
                              </Tooltip>
                              <Tooltip title="Delete">
                                <IconButton size="small" color="error">
                                  {/* Delete functionality to be implemented */}
                                </IconButton>
                              </Tooltip>
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </TableContainer>
                <TablePagination
                  rowsPerPageOptions={[15, 25, 50]}
                  component="div"
                  count={displayedReports.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  onPageChange={(event, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                  }}
                />
              </Paper>
            ) : (
              <Box sx={{ py: 6, textAlign: 'center' }}>
                <Typography color="text.secondary">No reports found in this category.</Typography>
                <Button variant="contained" sx={{ mt: 2 }} onClick={onCreateNewReport}>Create New Report</Button>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      <Box component="footer" sx={{ py: 3, px: 2, mt: 'auto', backgroundColor: (theme) => theme.palette.grey[100] }}>
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            NetGen Reporting Tool - Organization Dashboard
          </Typography>
        </Container>
      </Box>


    </>
  );
};

export default HomePage;
