// src/pages/Dashboard/TabSettings.js
import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Stack,
  IconButton,
  Tooltip,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { toggleTheme } from '../../redux/slices/uiSlice'; // existing action
import { logout } from '../../redux/slices/authSlice';
import LanguageSwitcher from '../../components/Layout/LanguageSwitcher';
import { useTranslation } from 'react-i18next';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import LogoutIcon from '@mui/icons-material/Logout';

export default function TabSettings() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const dir = i18n.dir ? i18n.dir() : document.documentElement.dir || 'rtl';
  const theme = useTheme();
  const appliedIsDark = theme.palette.mode === 'dark';

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return (
    <Box>
      {/* header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mb: 2,
          gap: 2,
          flexWrap: 'wrap',
        }}
      >
        <Typography variant="h5" sx={{ fontWeight: 800 }}>
          {t('settings')}
        </Typography>
      </Box>

      {/* settings card */}
      <Card
        sx={{
          maxWidth: 920,
          borderRadius: 2,
          border: `1px solid rgba(255,255,255,0.04)`,
          background: (th) =>
            th.palette.mode === 'dark'
              ? `linear-gradient(145deg, rgba(255,255,255,0.006), rgba(0,0,0,0.06))`
              : `linear-gradient(145deg, rgba(255,255,255,0.96), rgba(240,246,255,0.98))`,
          boxShadow: (th) =>
            th.palette.mode === 'dark'
              ? `12px 12px 0px ${th.palette.primary.main}12, -10px -10px 0px ${th.palette.secondary.main}08, 0 30px 80px rgba(0,0,0,0.6)`
              : `8px 8px 0px rgba(20,80,140,0.04), -6px -6px 0px rgba(195,58,99,0.02), 0 18px 48px rgba(20,30,40,0.06)`,
        }}
      >
        <CardContent>
          <Stack spacing={3} direction="column" sx={{ alignItems: 'stretch' }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, pt: 10 }}>
              <LanguageSwitcher sx={{ ml: dir === 'rtl' ? 0 : 1, width: '100%' }} />
              <Tooltip title={appliedIsDark ? t('switch_to_light') : t('switch_to_dark')}>
                <IconButton
                  aria-label={appliedIsDark ? t('switch_to_light') : t('switch_to_dark')}
                  onClick={handleToggleTheme}
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 1,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: (th) =>
                      `linear-gradient(135deg, ${th.palette.primary.main}, ${th.palette.secondary.main})`,
                    color: (th) => (th.palette.mode === 'dark' ? '#071021' : '#fff'),
                    boxShadow: (th) =>
                      th.palette.mode === 'dark'
                        ? `0 8px 22px ${th.palette.primary.main}22, -6px -6px 12px ${th.palette.secondary.main}0E`
                        : `0 6px 18px ${th.palette.primary.main}14`,
                    transition: 'transform 140ms ease, box-shadow 160ms ease, opacity 200ms ease',
                    '&:active': { transform: 'translateY(1px) scale(0.995)', opacity: 0.96 },
                    '&:hover': { transform: 'translateY(-2px)' },
                  }}
                >
                  {appliedIsDark ? (
                    <LightModeIcon fontSize="small" />
                  ) : (
                    <DarkModeIcon fontSize="small" />
                  )}
                </IconButton>
              </Tooltip>
              {/* Logout row (styled CTA) */}
              <Box
                sx={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                }}
              >
                <Button
                  onClick={() => dispatch(logout())}
                  variant="outlined"
                  sx={(th) => ({
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 1,
                    borderRadius: 1,
                    fontWeight: 800,
                    px: 3,
                    backgroundImage:
                      th.palette.mode === 'dark'
                        ? `linear-gradient(90deg,rgb(19, 233, 233) 0%,rgb(228, 178, 225) 100%)`
                        : `linear-gradient(90deg, var(--tech-brown), ${th.palette.primary.main})`,
                    color: th.palette.mode === 'dark' ? '#071021' : '#071021',
                    boxShadow:
                      th.palette.mode === 'dark'
                        ? `0 12px 40px ${th.palette.warning.main}22, 6px 6px 0px ${th.palette.warning.main}0D`
                        : `0 8px 24px rgba(10,80,120,0.06)`,
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow:
                        th.palette.mode === 'dark'
                          ? `0 20px 60px ${th.palette.warning.main}2E, 10px 10px 0px ${th.palette.secondary.main}0A`
                          : `0 12px 36px rgba(10,80,120,0.12)`,
                    },
                  })}
                  startIcon={<LogoutIcon />}
                  aria-label={t('logout')}
                >
                  {t('logout')}
                </Button>
              </Box>
            </Box>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
