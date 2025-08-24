// src/components/LanguageSwitcher.js
import React from 'react';
import PropTypes from 'prop-types';
import { MenuItem, Select, FormControl } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher({ sx }) {
  const { i18n } = useTranslation();
  const lang = i18n.language || 'fa';

  const handleChange = (e) => {
    const newLng = e.target.value;
    i18n.changeLanguage(newLng);
    localStorage.setItem('appLng', newLng);
    document.documentElement.lang = newLng;
    document.documentElement.dir = newLng === 'fa' ? 'rtl' : 'ltr';
  };

  return (
    <FormControl size="small" sx={sx}>
      <Select value={lang} onChange={handleChange} autoWidth>
        <MenuItem value="fa">فارسی</MenuItem>
        <MenuItem value="en">English</MenuItem>
      </Select>
    </FormControl>
  );
}

LanguageSwitcher.propTypes = {
  sx: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
