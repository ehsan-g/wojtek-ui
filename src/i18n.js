// src/i18n.js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en/translation.json';
import fa from './locales/fa/translation.json';

const resources = {
  en: { translation: en },
  fa: { translation: fa },
};

// force default to Farsi if no saved language
const savedLng = localStorage.getItem('appLng') || 'fa';

i18n.use(initReactI18next).init({
  resources,
  lng: savedLng, // always start from Farsi
  fallbackLng: 'fa', // never fallback to English unless manually switched
  interpolation: { escapeValue: false },
});

// update HTML direction + lang attribute dynamically
document.documentElement.lang = savedLng;
document.documentElement.dir = savedLng === 'fa' ? 'rtl' : 'ltr';

export default i18n;
