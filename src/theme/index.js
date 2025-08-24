// src/theme/index.js
import { createTheme } from '@mui/material/styles';

/**
 * Fixed theme factory — no early 'theme' access.
 * - Uses pal (dark/light) constants inside getTheme
 * - styleOverrides only reference pal or use function form where safe
 */

const DARK = {
  STEEL_800: '#12161A',
  STEEL_600: '#263238',
  STEEL_400: '#4A5560',
  ELECTRIC_CYAN: '#00F8FF',
  ELECTRIC_BLUE: '#3AB0FF',
  NEON_AMBER: '#FFB659',
  NEON_MAGENTA: '#FF3E8A',
  NEUTRAL_BROWN: '#A66A3D',
  ACCENT_LIME: '#C7FF6B',
  SURFACE: '#071018',
  PAPER: 'rgba(255,255,255,0.02)',
  TEXT_PRIMARY: '#EAF8FF',
  TEXT_SECONDARY: '#BEEBFF',
  ERROR: '#ff3860',
};

const LIGHT = {
  STEEL_800: '#EAF6FB',
  STEEL_600: '#D8EEF6',
  STEEL_400: '#BFDCEB',
  ELECTRIC_CYAN: '#007589',
  ELECTRIC_BLUE: '#1E78C6',
  NEON_AMBER: '#FF9A3F',
  NEON_MAGENTA: '#C74A6A',
  NEUTRAL_BROWN: '#B98A63',
  ACCENT_LIME: '#AEDD6A',
  SURFACE: '#F6FBFF',
  PAPER: 'rgba(6,12,20,0.02)',
  TEXT_PRIMARY: '#071021',
  TEXT_SECONDARY: '#2F5166',
  ERROR: '#c0392b',
};

const common = {
  typography: {
    fontFamily: ['Inter', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'].join(','),
    h5: { fontWeight: 800, letterSpacing: '-0.01em' },
    button: { textTransform: 'none', fontWeight: 800 },
    body1: { lineHeight: 1.6 },
  },
};

export const getTheme = (mode = 'dark') => {
  const pal = mode === 'dark' ? DARK : LIGHT;

  const theme = createTheme({
    palette: {
      mode,
      primary: { main: pal.ELECTRIC_CYAN, contrastText: mode === 'dark' ? '#071021' : '#ffffff' },
      secondary: { main: pal.ELECTRIC_BLUE, contrastText: '#071021' },
      background: { default: pal.SURFACE, paper: pal.PAPER },
      text: { primary: pal.TEXT_PRIMARY, secondary: pal.TEXT_SECONDARY },
      warning: { main: pal.NEON_AMBER },
      error: { main: pal.ERROR },
    },

    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            transition: 'transform 160ms ease, box-shadow 160ms ease',
          },
        },
      },
      MuiAvatar: {
        styleOverrides: {
          root: {
            width: 44,
            height: 44,
            fontWeight: 600,
          },
        },
      },
      // Ensure selected MenuItem uses the requested cyan background
      MuiMenuItem: {
        styleOverrides: {
          root: {
            '&.Mui-selected': {
              backgroundColor: pal.STEEL_400,
            },
            '&.Mui-selected:hover': {
              backgroundColor: 'rgba(0, 248, 255, 0.18)',
            },
          },
        },
      },
      MuiCssBaseline: {
        // Use a function to return styleOverrides if you want theme-based dynamic values.
        // Here we avoid referencing `theme` before initialization by using 'pal' constants.
        styleOverrides: {
          ':root': {
            '--tech-steel-800': pal.STEEL_800,
            '--tech-steel-600': pal.STEEL_600,
            '--tech-cyan': pal.ELECTRIC_CYAN,
            '--tech-blue': pal.ELECTRIC_BLUE,
            '--tech-amber': pal.NEON_AMBER,
            '--tech-magenta': pal.NEON_MAGENTA,
            '--tech-brown': pal.NEUTRAL_BROWN,
            '--tech-lime': pal.ACCENT_LIME,
          },
          body: {
            backgroundColor: pal.SURFACE,
            color: pal.TEXT_PRIMARY,
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',
          },

          /* ===== Global classes for logs UI ===== */
          '.logs-root': {
            width: '100%',
            maxWidth: '920px',
            borderRadius: 8,
            padding: '12px',
            background: mode === 'dark' ? 'rgba(255,255,255,0.012)' : 'rgba(255,255,255,0.96)',
            border: `1px solid ${mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(0,0,0,0.04)'}`,
            boxShadow:
              mode === 'dark'
                ? `8px 8px 0px ${pal.ELECTRIC_CYAN}10, -6px -6px 0px ${pal.NEON_MAGENTA}06`
                : `6px 6px 0px rgba(20,80,140,0.04)`,
            overflow: 'hidden',
          },
          '.logs-list': {
            maxHeight: '48vh',
            overflowY: 'auto',
            fontFamily: `"Inter", sans-serif`,
            fontSize: '0.95rem',
            lineHeight: 1.5,
            padding: 0,
            margin: 0,
            listStyle: 'none',
          },
          '.log-line': {
            display: 'block',
            padding: '6px 10px',
            borderBottom: `1px dashed ${mode === 'dark' ? 'rgba(255,255,255,0.02)' : 'rgba(0,0,0,0.04)'}`,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          },
          '.log-line-info': {
            background:
              mode === 'dark'
                ? `linear-gradient(90deg, rgba(0,248,255,0.02), transparent)`
                : 'transparent',
            color: mode === 'dark' ? pal.ELECTRIC_CYAN : pal.ELECTRIC_BLUE,
          },
          '.log-line-warn': {
            background:
              mode === 'dark'
                ? `linear-gradient(90deg, rgba(255,182,90,0.03), transparent)`
                : 'transparent',
            color: mode === 'dark' ? pal.NEON_AMBER : pal.NEUTRAL_BROWN,
            fontWeight: 700,
          },
          '.log-line-error': {
            background:
              mode === 'dark'
                ? `linear-gradient(90deg, rgba(255,50,120,0.03), transparent)`
                : 'transparent',
            color: mode === 'dark' ? pal.ERROR : pal.ERROR,
            fontWeight: 900,
          },
          '.log-line-debug': {
            background:
              mode === 'dark'
                ? `linear-gradient(90deg, rgba(200,200,200,0.02), transparent)`
                : 'transparent',
            color: mode === 'dark' ? '#9fb6c9' : '#556b7a',
          },
        },
      },

      MuiPaper: {
        styleOverrides: {
          root: {
            borderRadius: 2,
            border: `1px solid rgba(255,255,255,0.03)`,
            background:
              mode === 'dark'
                ? `linear-gradient(180deg, rgba(255,255,255,0.012), rgba(0,0,0,0.08))`
                : `linear-gradient(180deg, rgba(255,255,255,0.9), rgba(240,246,255,0.98))`,
            transition: 'transform 180ms ease, box-shadow 180ms ease',
            boxShadow:
              mode === 'dark'
                ? `10px 10px 0px rgba(0,215,255,0.06), -10px -10px 0px rgba(255,45,134,0.04), 0 20px 60px rgba(0,0,0,0.6)`
                : `6px 6px 0px rgba(10,80,120,0.05), -6px -6px 0px rgba(195,58,99,0.02), 0 12px 34px rgba(20,30,40,0.06)`,
            overflow: 'visible',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow:
                mode === 'dark'
                  ? `16px 16px 0px rgba(0,215,255,0.12), -16px -16px 0px rgba(255,45,134,0.08), 0 36px 100px rgba(0,0,0,0.75)`
                  : `10px 10px 0px rgba(10,80,120,0.08), -10px -10px 0px rgba(195,58,99,0.04), 0 26px 68px rgba(20,30,40,0.12)`,
            },
          },
          elevation1: {
            boxShadow:
              mode === 'dark'
                ? '0 14px 40px rgba(0,215,255,0.06)'
                : '0 8px 20px rgba(10,80,120,0.06)',
          },
        },
      },

      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            fontWeight: 800,
            letterSpacing: 0.3,
            padding: '10px 16px',
            transition: 'all 160ms ease',
          },
          containedPrimary: {
            backgroundImage: `linear-gradient(90deg, ${pal.ELECTRIC_CYAN}, ${pal.ELECTRIC_BLUE})`,
            color: mode === 'dark' ? '#071021' : '#fff',
            boxShadow:
              mode === 'dark'
                ? `0 12px 40px rgba(0,215,255,0.14), 6px 6px 0px rgba(0,215,255,0.06)`
                : `0 8px 20px rgba(10,80,120,0.08)`,
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow:
                mode === 'dark'
                  ? `0 20px 60px rgba(0,215,255,0.22), 10px 10px 0px rgba(255,45,134,0.06)`
                  : `0 12px 36px rgba(10,80,120,0.12)`,
            },
          },
          containedSecondary: {
            backgroundImage:
              mode === 'dark'
                ? `linear-gradient(90deg, ${pal.NEON_AMBER}, ${pal.ELECTRIC_CYAN})`
                : `linear-gradient(90deg, ${pal.NEUTRAL_BROWN}, ${pal.ELECTRIC_CYAN})`,
            color: mode === 'dark' ? '#071021' : '#071021',
            '&:hover': { transform: 'translateY(-2px)' },
          },
          outlined: {
            border: `1px solid rgba(255,255,255,0.04)`,
            '&:hover': { background: 'rgba(255,255,255,0.01)' },
          },
        },
      },

      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: 'transparent',
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: pal.ELECTRIC_CYAN,
            },
            '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: pal.ELECTRIC_CYAN,
              boxShadow: `0 8px 28px ${pal.ELECTRIC_CYAN}22`,
            },
          },
          input: {
            padding: '12px 14px',
            color: pal.TEXT_PRIMARY,
          },
        },
      },

      MuiFilledInput: {
        styleOverrides: {
          root: {
            borderRadius: 10,
            backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.018)' : 'rgba(6,12,20,0.02)',
            '&:hover': {
              backgroundColor: mode === 'dark' ? 'rgba(255,255,255,0.03)' : 'rgba(6,12,20,0.04)',
            },
            '&.Mui-focused': {
              boxShadow: `0 8px 28px ${pal.ELECTRIC_CYAN}22`,
            },
          },
          input: {
            padding: '12px 14px',
            color: pal.TEXT_PRIMARY,
          },
        },
      },

      MuiAlert: {
        styleOverrides: {
          root: {
            borderRadius: 6,
            border: `1px solid rgba(255,184,107,0.14)`,
            boxShadow:
              mode === 'dark'
                ? `6px 6px 0px rgba(255,184,107,0.06)`
                : `4px 4px 0px rgba(166,112,83,0.04)`,
            background: mode === 'dark' ? 'rgba(255,184,107,0.06)' : 'rgba(166,112,83,0.04)',
          },
        },
      },

      MuiIconButton: {
        styleOverrides: {
          root: { color: 'inherit', '&:hover': { background: 'rgba(255,255,255,0.02)' } },
        },
      },

      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            background: pal.STEEL_600,
            color: pal.TEXT_PRIMARY,
            fontSize: 12,
            borderRadius: 6,
          },
        },
      },
    },

    ...common,
  });

  return theme;
};

export default getTheme;
