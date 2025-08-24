// src/components/Layout/BottomNavBar.js
import React, { useEffect, useState } from 'react';
import { BottomNavigation, BottomNavigationAction, Paper, Box, Fab, useTheme } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import DeviceHubIcon from '@mui/icons-material/DeviceHub';
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { useNavigate, useLocation } from 'react-router-dom';
import AddFormDialog from './AddFormDialog';

export default function BottomNavBar() {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();

  const getValue = () => {
    if (location.pathname.includes('/home/devices')) return 1;
    if (location.pathname.includes('/home/logs')) return 2;
    if (location.pathname.includes('/home/settings')) return 3;
    return 0;
  };

  const [TabValue, setTabValue] = useState(getValue());
  const [openAdd, setOpenAdd] = useState(false);

  useEffect(() => {
    setTabValue(getValue());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  const onChange = (e, v) => {
    setTabValue(v);
    switch (v) {
      case 0:
        navigate('/home');
        break;
      case 1:
        navigate('/home/devices');
        break;
      case 2:
        navigate('/home/logs');
        break;
      case 3:
        navigate('/home/settings');
        break;
      default:
        break;
    }
  };

  return (
    <Box
      sx={{
        position: 'fixed',
        left: 0,
        right: 0,
        bottom: 16,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        px: 2,
      }}
    >
      <Paper
        elevation={10}
        sx={{
          pointerEvents: 'auto',
          borderRadius: 3,
          width: 'min(920px, 100%)',
          px: 2,
        }}
      >
        <BottomNavigation
          showLabels
          value={TabValue}
          sx={{
            backgroundColor: theme.palette.background.default,
          }}
          onChange={onChange}
        >
          <BottomNavigationAction label="Home" icon={<HomeIcon />} />
          <BottomNavigationAction label="Devices" icon={<DeviceHubIcon />} />
          <BottomNavigationAction label="logs" icon={<PersonIcon />} />
          <BottomNavigationAction label="Settings" icon={<SettingsIcon />} />
        </BottomNavigation>

        {/* Centered FAB overlapping the bar */}
        {TabValue === 1 && (
          <Fab
            color="secondary"
            aria-label="add"
            onClick={() => setOpenAdd(true)}
            sx={{
              position: 'absolute',
              transform: 'translateY(-140px)',
              boxShadow: (theme) =>
                theme.palette.mode === 'dark'
                  ? `0 10px 30px ${theme.palette.secondary.main}22`
                  : undefined,
            }}
          >
            <AddCircleOutlineIcon />
          </Fab>
        )}
      </Paper>
      <AddFormDialog open={openAdd} onClose={() => setOpenAdd(false)} />
    </Box>
  );
}
