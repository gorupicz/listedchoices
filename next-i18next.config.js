const path = require('path');

module.exports = {
  i18n: {
    defaultLocale: 'es',
    locales: ['en', 'es'],
  },
  localePath: path.resolve('./src/data'), // Points to your data directory
  debug: true,
};
