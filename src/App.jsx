// src/App.js
import React, { useEffect } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { getTheme } from './theme';
import RoutesConfig from './routes';
import { useTranslation } from 'react-i18next';
import createCache from '@emotion/cache';
import rtlPlugin from 'stylis-plugin-rtl';
import { CacheProvider } from '@emotion/react';
import { setUserFromToken } from './redux/slices/authSlice';
import { setAuthToken } from './utils/authToken';

export default function App() {
  const themeMode = useSelector((s) => s.ui.themeMode);
  const { i18n } = useTranslation();
  const lang = i18n.language || 'en';

  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('userInfo');
    if (token) {
      setAuthToken(token); // restore axios headers
      dispatch(setUserFromToken(token));
    }
  }, [dispatch]);

  useEffect(() => {
    document.documentElement.dir = lang === 'fa' ? 'rtl' : 'ltr';
  }, [lang]);

  const cache = React.useMemo(() => {
    if (lang === 'fa') {
      return createCache({
        key: 'mui-rtl',
        stylisPlugins: [rtlPlugin],
        prepend: true,
      });
    }
    return createCache({ key: 'mui', prepend: true });
  }, [lang]);

  const theme = React.useMemo(() => {
    const t = getTheme(themeMode);
    t.direction = lang === 'fa' ? 'rtl' : 'ltr';
    return t;
  }, [themeMode, lang]);

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RoutesConfig />
      </ThemeProvider>
    </CacheProvider>
  );
}
