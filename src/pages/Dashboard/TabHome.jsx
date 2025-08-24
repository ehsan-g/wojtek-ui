import React from 'react';
import { Grid, Typography, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { DeviceTypes } from '../../utils/enums';
import StreamManager from '../../components/StreamManager';

export default function TabOne() {
  const { t } = useTranslation();

  const { devices } = useSelector((state) => state.devices);

  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 2, fontWeight: 800 }}>
        {t('overview')}
      </Typography>
      {devices &&
        devices.map((d, idx) =>
          d.type === DeviceTypes.STREAM ? (
            <Grid container spacing={2} key={idx}>
              <Grid item xs={12} sm={6} md={4}>
                <StreamManager title={d.name} />
              </Grid>
            </Grid>
          ) : (
            <Grid item xs={12} sm={6} md={4} key={idx} />
          )
        )}
    </Box>
  );
}
