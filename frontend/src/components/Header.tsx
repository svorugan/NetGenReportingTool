import React from 'react';
import { AppBar, Toolbar, Typography, Box } from '@mui/material';
import StorageIcon from '@mui/icons-material/Storage';

const Header: React.FC = () => {
  return (
    <AppBar position="static" color="primary">
      <Toolbar>
        <StorageIcon sx={{ mr: 2 }} />
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          NetGen Reporting Tool
        </Typography>
        <Box>
          <Typography variant="subtitle2">
            Oracle Database Connected
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
