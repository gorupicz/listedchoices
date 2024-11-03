/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'localhost',
      'bolsadecasas.mx',
      'listedchoice.com',
      'listedchoices.com',
      'pps.whatsapp.net',
      'scontent.fisj3-3.fna.fbcdn.net'
    ],
  },
}

module.exports = nextConfig
