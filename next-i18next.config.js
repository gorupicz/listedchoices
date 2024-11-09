const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'es',
    locales: ['en', 'es'], // Add your supported languages here
  },
  localePath: path.resolve('./src/data/login'),
};
