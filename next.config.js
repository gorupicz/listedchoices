/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  images: {
    domains: [
      'localhost',
      'bolsadecasas.mx',
      'listedchoice.com',
      'listedchoices.com',
      'pps.whatsapp.net',
      'scontent.fisj3-3.fna.fbcdn.net',
      'a0.muscache.com'
    ],
  },
  i18n: {
    locales: ['en', 'es'], // Add your supported languages here
    defaultLocale: 'es',
  },
}

module.exports = nextConfig
