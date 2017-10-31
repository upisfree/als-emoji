const LANG = {
  EN: 'en',
  RU: 'ru'
};

// franc (language detection library) uses ISO 639-2 instead ISO 639-1 which uses in Unicode, so we need a code converter
LANG.FRANC = {
  'rus': LANG.RU,
  'eng': LANG.EN,
};

module.exports = LANG;