// src/pages/Dashboard/TabDevices.js
import React from 'react';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import DeviceCards from '../../components/DeviceCards';

export default function TabDevices() {
  const { t, i18n } = useTranslation();
  const dir = i18n.dir ? i18n.dir() : document.documentElement.dir || 'rtl';

  const { devices, loading } = useSelector((state) => state.devices);
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 800 }}>
        {t('device_tab')}
      </Typography>

      <Card sx={{ maxWidth: 920, width: '100%', minHeight: '70vh' }}>
        <CardContent
          sx={{
            display: 'flex',
            gap: 1,
            alignItems: 'center',
            flexWrap: 'wrap',
            direction: dir,
          }}
        >
          {loading ? <CircularProgress /> : <DeviceCards devices={devices} />}
        </CardContent>
      </Card>
    </Box>
  );
}
