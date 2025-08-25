// src/pages/Auth/LoginPage.js
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Divider,
  Alert,
  Stack,
  useMediaQuery,
  IconButton,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { login, clearError } from '../../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/Layout/LanguageSwitcher';
import PasswordField from '../../components/Input/PasswordField';
import { isValidEmail } from '../../utils/validators';
import CloseIcon from '@mui/icons-material/Close';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { loading, error, token } = useSelector((s) => s.auth);
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.down('sm'));

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    if (token) navigate('/home', { replace: true });
  }, [token, navigate]);

  const dir = i18n.dir ? i18n.dir() : document.documentElement.dir || 'rtl';

  const submit = async (e) => {
    e?.preventDefault();
    setLocalError(null);
    if (!isValidEmail(email)) return setLocalError(t('invalid_email'));
    if (!password) return setLocalError(t('password_required'));

    try {
      await dispatch(login({ email, password })).unwrap();
      navigate('/home', { replace: true });
    } catch (e) {
      setLocalError(error || `${t('error.invalid_credentials')} ${e?.statusCode ?? ''}`);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 3,
        background: (theme) =>
          theme.palette.mode === 'dark'
            ? `radial-gradient(700px 350px at 12% 12%, ${theme.palette.primary.main}12, transparent),
               radial-gradient(600px 300px at 92% 88%, ${theme.palette.secondary.main}08, transparent),
               ${theme.palette.background.default}`
            : `linear-gradient(180deg, ${theme.palette.background.default}, ${theme.palette.background.paper})`,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 480,
          borderRadius: 2,
          border: `1px solid rgba(255,255,255,0.04)`,
          overflow: 'visible',
          background: (theme) =>
            theme.palette.mode === 'dark'
              ? `linear-gradient(145deg, rgba(255,255,255,0.008), rgba(0,0,0,0.06))`
              : `linear-gradient(145deg, rgba(255,255,255,0.95), rgba(240,246,255,0.98))`,
          boxShadow: (theme) =>
            theme.palette.mode === 'dark'
              ? `12px 12px 0px ${theme.palette.primary.main}12, -10px -10px 0px ${theme.palette.secondary.main}08, 0 30px 80px rgba(0,0,0,0.6)`
              : `8px 8px 0px rgba(20,80,140,0.04), -6px -6px 0px rgba(195,58,99,0.02), 0 18px 48px rgba(20,30,40,0.06)`,
          transition: 'transform 180ms ease, box-shadow 180ms ease',
          '&:hover': {
            transform: 'translateY(-6px)',
            boxShadow: (theme) =>
              theme.palette.mode === 'dark'
                ? `18px 18px 0px ${theme.palette.primary.main}18, -14px -14px 0px ${theme.palette.secondary.main}0D, 0 44px 120px rgba(0,0,0,0.75)`
                : `12px 12px 0px rgba(20,80,140,0.06), -10px -10px 0px rgba(195,58,99,0.03), 0 28px 72px rgba(20,30,40,0.12)`,
          },
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 }, direction: dir }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                id="logo"
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: 2,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: (theme) => (theme.palette.mode !== 'dark' ? '#071021' : '#fff'),
                  fontWeight: 900,
                  fontSize: 45,
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? `0 10px 28px ${theme.palette.primary.main}22`
                      : `0 8px 20px ${theme.palette.primary.main}14`,
                }}
              >
                و
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <Typography
                  id="logo"
                  variant="h6"
                  sx={{ fontWeight: 800, fontSize: isXs ? '1.2rem' : '1.5rem' }}
                >
                  {t('brand')}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3 }}>
                  {t('sign_in_to_continue_short', {
                    defaultValue: t('sign_in_to_continue', { brand: t('brand') }),
                  })}
                </Typography>
              </Box>
            </Box>

            <LanguageSwitcher sx={{ ml: dir === 'rtl' ? 0 : 1 }} />
          </Box>

          <Box component="form" onSubmit={submit} sx={{ mt: 1 }}>
            <Stack spacing={1.25} alignItems="center">
              {!dismissed && (localError || error) && (
                <Alert
                  severity="error"
                  sx={{
                    width: '100%',
                    maxWidth: 420,
                    position: 'relative',
                    direction: 'ltr !important',
                    fontWeight: 700,
                    borderRadius: 1,
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? `6px 6px 0px ${theme.palette.warning.main}14`
                        : `4px 4px 0px rgba(167,118,90,0.04)`,
                    background: (theme) =>
                      theme.palette.mode === 'dark'
                        ? `rgba(255,184,107,0.06)`
                        : `rgba(167,118,90,0.04)`,
                  }}
                >
                  <IconButton
                    size="small"
                    onClick={() => setDismissed(true)}
                    sx={{ position: 'absolute', top: 6, right: 6 }}
                    aria-label="dismiss"
                  >
                    <CloseIcon fontSize="small" />
                  </IconButton>
                  {localError || error}
                </Alert>
              )}

              <TextField
                label={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                variant="outlined"
                margin="dense"
                dir={dir}
                sx={{
                  maxWidth: 420,
                  width: '100%',
                  mx: 'auto',
                }}
                inputProps={{ 'aria-label': t('email') }}
              />

              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ maxWidth: 420, width: '100%' }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{
                  mt: 1,
                  py: 1.15,
                  maxWidth: 420,
                  borderRadius: 1,
                  fontWeight: 800,
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? `0 12px 40px ${theme.palette.primary.main}22, 6px 6px 0px ${theme.palette.primary.main}10`
                      : undefined,
                }}
              >
                {loading ? t('logging_in') : t('login')}
              </Button>

              <Divider sx={{ my: 0.5, opacity: 0.06, width: '100%', maxWidth: 420 }} />

              <Box
                sx={{
                  textAlign: dir === 'rtl' ? 'right' : 'left',
                  py: 1,
                  width: '100%',
                  maxWidth: 420,
                }}
              >
                <Typography variant="body2">
                  {t('dont_have_account')}{' '}
                  <Link
                    to="/register"
                    style={{
                      fontWeight: 700,
                      textDecoration: 'none',
                      color: 'var(--tech-cyan)',
                    }}
                  >
                    {t('create_account')}
                  </Link>
                </Typography>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
