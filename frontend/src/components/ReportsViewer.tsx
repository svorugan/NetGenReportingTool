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
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  Chip
} from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import DeleteIcon from '@mui/icons-material/Delete';
import ScheduleIcon from '@mui/icons-material/Schedule';
import EditIcon from '@mui/icons-material/Edit';

interface ReportsViewerProps {
  reports: any[];
  isLoading: boolean;
  onRunReport: (sql: string) => Promise<void>;
  onDeleteReport: (id: string) => Promise<void>;
  onScheduleReport: (reportId: string, schedule: any) => Promise<void>;
}

const ReportsViewer: React.FC<ReportsViewerProps> = ({
  reports,
  isLoading,
  onRunReport,
  onDeleteReport,
  onScheduleReport
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleDialogOpen, setScheduleDialogOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [scheduleFrequency, setScheduleFrequency] = useState('daily');
  const [scheduleTime, setScheduleTime] = useState('08:00');
  const [scheduleDay, setScheduleDay] = useState('1');
  const [confirmDelete, setConfirmDelete] = useState('');

  const handleOpenDeleteDialog = (report: any) => {
    setSelectedReport(report);
    setDeleteDialogOpen(true);
  };

  const handleCloseDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setSelectedReport(null);
    setConfirmDelete('');
  };

  const handleOpenScheduleDialog = (report: any) => {
    setSelectedReport(report);
    setScheduleDialogOpen(true);
    
    // If report already has a schedule, populate the form
    if (report.schedule) {
      setScheduleFrequency(report.schedule.frequency);
      setScheduleTime(report.schedule.time);
      if (report.schedule.day) {
        setScheduleDay(report.schedule.day);
      }
    }
  };

  const handleCloseScheduleDialog = () => {
    setScheduleDialogOpen(false);
    setSelectedReport(null);
    // Reset form
    setScheduleFrequency('daily');
    setScheduleTime('08:00');
    setScheduleDay('1');
  };

  const handleDeleteReport = async () => {
    if (selectedReport && confirmDelete === selectedReport.name) {
      await onDeleteReport(selectedReport.id);
      handleCloseDeleteDialog();
    }
  };

  const handleScheduleReport = async () => {
    if (selectedReport) {
      const schedule = {
        frequency: scheduleFrequency,
        time: scheduleTime,
        day: scheduleFrequency === 'monthly' || scheduleFrequency === 'weekly' ? scheduleDay : undefined
      };
      
      await onScheduleReport(selectedReport.id, schedule);
      handleCloseScheduleDialog();
    }
  };

  const getScheduleDisplay = (schedule: any) => {
    if (!schedule) return 'Not scheduled';
    
    let display = `${schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1)} at ${schedule.time}`;
    
    if (schedule.frequency === 'weekly') {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      display += ` on ${days[parseInt(schedule.day) % 7]}`;
    } else if (schedule.frequency === 'monthly') {
      const day = parseInt(schedule.day);
      const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
      display += ` on the ${day}${suffix}`;
    }
    
    return display;
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">Saved Reports</Typography>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CircularProgress />
        </Box>
      ) : reports.length > 0 ? (
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell><strong>Report Name</strong></TableCell>
                <TableCell><strong>Description</strong></TableCell>
                <TableCell><strong>Created</strong></TableCell>
                <TableCell><strong>Schedule</strong></TableCell>
                <TableCell><strong>Actions</strong></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {reports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>{report.name}</TableCell>
                  <TableCell>{report.description || '-'}</TableCell>
                  <TableCell>{new Date(report.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    {report.schedule ? (
                      <Chip 
                        label={getScheduleDisplay(report.schedule)} 
                        color="primary" 
                        size="small" 
                        variant="outlined"
                      />
                    ) : (
                      'Not scheduled'
                    )}
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex' }}>
                      <Tooltip title="Run Report">
                        <IconButton 
                          size="small" 
                          onClick={() => onRunReport(report.sql)}
                          color="primary"
                        >
                          <PlayArrowIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Schedule Report">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenScheduleDialog(report)}
                          color="primary"
                        >
                          <ScheduleIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Report">
                        <IconButton 
                          size="small" 
                          onClick={() => handleOpenDeleteDialog(report)}
                          color="error"
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <Typography color="text.secondary">No saved reports found</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Generate and save a report from the Query Builder tab to see it here.
          </Typography>
        </Box>
      )}

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={handleCloseDeleteDialog}>
        <DialogTitle>Delete Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete the report "{selectedReport?.name}"? This action cannot be undone.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            id="confirm"
            label={`Type "${selectedReport?.name}" to confirm`}
            fullWidth
            variant="outlined"
            value={confirmDelete}
            onChange={(e) => setConfirmDelete(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
          <Button 
            onClick={handleDeleteReport} 
            color="error" 
            variant="contained" 
            disabled={confirmDelete !== selectedReport?.name}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Schedule Dialog */}
      <Dialog open={scheduleDialogOpen} onClose={handleCloseScheduleDialog}>
        <DialogTitle>Schedule Report</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Set up automatic execution schedule for report "{selectedReport?.name}".
          </DialogContentText>
          
          <FormControl fullWidth margin="normal">
            <InputLabel id="frequency-label">Frequency</InputLabel>
            <Select
              labelId="frequency-label"
              id="frequency"
              value={scheduleFrequency}
              label="Frequency"
              onChange={(e) => setScheduleFrequency(e.target.value)}
            >
              <MenuItem value="daily">Daily</MenuItem>
              <MenuItem value="weekly">Weekly</MenuItem>
              <MenuItem value="monthly">Monthly</MenuItem>
            </Select>
          </FormControl>
          
          {scheduleFrequency === 'weekly' && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="day-label">Day of Week</InputLabel>
              <Select
                labelId="day-label"
                id="day"
                value={scheduleDay}
                label="Day of Week"
                onChange={(e) => setScheduleDay(e.target.value)}
              >
                <MenuItem value="0">Sunday</MenuItem>
                <MenuItem value="1">Monday</MenuItem>
                <MenuItem value="2">Tuesday</MenuItem>
                <MenuItem value="3">Wednesday</MenuItem>
                <MenuItem value="4">Thursday</MenuItem>
                <MenuItem value="5">Friday</MenuItem>
                <MenuItem value="6">Saturday</MenuItem>
              </Select>
            </FormControl>
          )}
          
          {scheduleFrequency === 'monthly' && (
            <FormControl fullWidth margin="normal">
              <InputLabel id="day-label">Day of Month</InputLabel>
              <Select
                labelId="day-label"
                id="day"
                value={scheduleDay}
                label="Day of Month"
                onChange={(e) => setScheduleDay(e.target.value)}
              >
                {[...Array(28)].map((_, i) => (
                  <MenuItem key={i + 1} value={(i + 1).toString()}>{i + 1}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}
          
          <TextField
            margin="normal"
            id="time"
            label="Time"
            type="time"
            fullWidth
            value={scheduleTime}
            onChange={(e) => setScheduleTime(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
            inputProps={{
              step: 300, // 5 min
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseScheduleDialog}>Cancel</Button>
          <Button 
            onClick={handleScheduleReport} 
            variant="contained" 
          >
            Save Schedule
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default ReportsViewer;
