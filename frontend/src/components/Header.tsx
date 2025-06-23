import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';
import LogoutIcon from '@mui/icons-material/Logout';

interface HeaderProps {
  onLogout: () => void;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({ onLogout, children }) => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <StorageIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          NetGen Reporting Tool
        </Typography>
        {children}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {/*<Typography variant="subtitle2" sx={{ mr: 2 }}>
            Oracle Database Connected
          </Typography>*/}
          <Button 
            color="inherit" 
            onClick={onLogout}
            startIcon={<LogoutIcon />}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
