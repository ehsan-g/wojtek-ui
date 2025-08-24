import React from 'react';
import { AppBar, Toolbar, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

export default function TopBar() {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <AppBar position="sticky" elevation={6} sx={{ backdropFilter: 'blur(6px)' }}>
      <Toolbar sx={{ gap: 2, px: { xs: 1.5, sm: 3, justifyContent: 'center' } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 44,
              height: 80,
              borderRadius: 2,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              background:
                theme.palette.mode === 'dark'
                  ? 'linear-gradient(135deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))'
                  : 'linear-gradient(135deg, rgba(0,0,0,0.03), rgba(0,0,0,0.01))',
            }}
          >
            <Typography
              id="logo"
              variant="h6"
              sx={{
                fontSize: 40,
                color: theme.palette.mode === 'dark' ? 'white' : 'darkGrey',
                opacity: '60%',
              }}
            >
              {t('brand')}
            </Typography>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
