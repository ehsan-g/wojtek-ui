// src/pages/Auth/RegisterPage.jsx
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
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/slices/authSlice';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/Layout/LanguageSwitcher';
import PasswordField from '../../components/Input/PasswordField';
import { isValidEmail, isStrongPassword } from '../../utils/validators';

export default function RegisterPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { loading, error, token } = useSelector((s) => s.auth);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState(null);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (token) navigate('/home', { replace: true });
  }, [token, navigate]);

  const dir = i18n.dir ? i18n.dir() : document.documentElement.dir || 'rtl';

  const submit = async (e) => {
    e?.preventDefault();
    setLocalError(null);
    if (!firstName.trim()) return setLocalError(t('first_name_required'));
    if (!lastName.trim()) return setLocalError(t('last_name_required'));
    if (!isValidEmail(email)) return setLocalError(t('invalid_email'));
    if (!isStrongPassword(password)) return setLocalError(`${t('error.password_too_weak')}`);
    try {
      await dispatch(register({ firstName, lastName, email, password })).unwrap();
      navigate('/home', { replace: true });
    } catch (e) {
      // keep helpful error message but prefer server error if present
      setLocalError(error || `${t('error.registration_failed')} ${e?.statusCode ?? ''}`);
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
        // subtle techno radial highlights (theme-aware via CSS vars)
        background: (theme) =>
          `radial-gradient(800px 400px at 12% 30%, ${theme.palette.primary.main}10, transparent),
           radial-gradient(700px 350px at 88% 70%, ${theme.palette.secondary.main}08, transparent),
           ${theme.palette.background.default}`,
      }}
    >
      <Card
        sx={{
          width: '100%',
          maxWidth: 460,
        }}
      >
        <CardContent sx={{ p: { xs: 3, sm: 4 }, direction: dir }}>
          {/* header row */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              gap: 2,
              flexWrap: 'wrap',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: 54,
                  height: 54,
                  borderRadius: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  color: (theme) => (theme.palette.mode === 'dark' ? '#071021' : '#fff'),
                  fontWeight: 900,
                  fontSize: 20,
                  boxShadow: (theme) =>
                    theme.palette.mode === 'dark'
                      ? `0 8px 24px ${theme.palette.primary.main}22`
                      : `0 6px 18px ${theme.palette.primary.main}14`,
                }}
              >
                ⚡
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  {t('create_account')}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3 }}>
                  {i18n.exists('register_subtitle')
                    ? t('register_subtitle')
                    : t('register_subtitle', { defaultValue: '' })}
                </Typography>
              </Box>
            </Box>

            <LanguageSwitcher sx={{ ml: dir === 'rtl' ? 0 : 1 }} />
          </Box>

          <Box component="form" onSubmit={submit} sx={{ mt: 1 }}>
            <Stack spacing={1.5} alignItems="center">
              {!dismissed && (localError || error) && (
                <Alert
                  severity="error"
                  sx={{
                    width: '100%',
                    maxWidth: 360,
                    position: 'relative',
                    direction: 'ltr !important',
                    fontWeight: 700,
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
                label={t('first_name')}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                size="small"
                fullWidth
                variant="outlined"
                margin="dense"
                dir={dir}
                sx={{ maxWidth: 360 }}
                inputProps={{ 'aria-label': t('first_name') }}
              />

              <TextField
                label={t('last_name')}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                size="small"
                fullWidth
                variant="outlined"
                margin="dense"
                dir={dir}
                sx={{ maxWidth: 360 }}
                inputProps={{ 'aria-label': t('last_name') }}
              />

              <TextField
                label={t('email')}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                size="small"
                fullWidth
                variant="outlined"
                margin="dense"
                dir={dir}
                sx={{ maxWidth: 360 }}
                inputProps={{ 'aria-label': t('email') }}
              />

              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                sx={{ maxWidth: 360, width: '100%' }}
              />

              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                disabled={loading}
                sx={{ mt: 1, maxWidth: 360 }}
              >
                {loading ? t('creating') : t('register')}
              </Button>

              <Divider sx={{ my: 0.5, opacity: 0.06, width: '100%', maxWidth: 360 }} />

              <Box
                sx={{
                  textAlign: dir === 'rtl' ? 'right' : 'left',
                  py: 1,
                  width: '100%',
                  maxWidth: 360,
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  {t('already_have_account')}{' '}
                  <Link
                    to="/login"
                    style={{ fontWeight: 700, color: 'var(--tech-cyan)', textDecoration: 'none' }}
                  >
                    {t('login')}
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
