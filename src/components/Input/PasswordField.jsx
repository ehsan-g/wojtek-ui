// src/components/PasswordField.js
import React from 'react';
import PropTypes from 'prop-types';
import { TextField, InputAdornment, IconButton } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useTranslation } from 'react-i18next';

export default function PasswordField({
  value,
  onChange,
  label,
  name = 'password',
  showToggle = true,
  autoComplete = 'current-password',
  required = true,
  sx = {},
}) {
  const { i18n, t } = useTranslation();
  const dir = i18n.dir ? i18n.dir() : document.documentElement.dir || 'rtl';
  const [show, setShow] = React.useState(false);

  return (
    <TextField
      label={label || t('password')}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      fullWidth
      size="small"
      variant="outlined"
      autoComplete={autoComplete}
      dir={dir}
      sx={{
        width: '100%',
        maxWidth: 360,
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.02)' : '#fff'),
        borderRadius: 2,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
        ...sx,
      }}
      InputProps={{
        endAdornment: showToggle ? (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShow((s) => !s)}
              edge="end"
              aria-label={show ? t('hide_password') : t('show_password')}
              size="large"
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ) : null,
      }}
    />
  );
}

PasswordField.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  label: PropTypes.string,
  name: PropTypes.string,
  showToggle: PropTypes.bool,
  autoComplete: PropTypes.string,
  required: PropTypes.bool,
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
