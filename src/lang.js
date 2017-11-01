const LANG = {
  DE: 'de', // German 🇩🇪
  EN: 'en', // English 🇬🇧
  ES: 'es', // Spanish 🇪🇸
  FR: 'fr', // French 🇫🇷
  IT: 'it', // Italian 🇮🇹
  PT: 'pt', // Portuguese 🇵🇹
  RU: 'ru', // Russian 🇷🇺
  TR: 'tr'  // Turkish 🇹🇷
};

// franc (библиотека, что определяет язык) использует ISO 639-2 вместо ISO 639-1, которым пользуется Юникод, поэтому нам нужен преобразователь
LANG.FRANC = {
  'deu': LANG.DE,
  'eng': LANG.EN,
  'spa': LANG.ES,
  'fra': LANG.FR,
  'ita': LANG.IT,
  'por': LANG.PT,
  'rus': LANG.RU,
  'tur': LANG.TR
};

module.exports = LANG;