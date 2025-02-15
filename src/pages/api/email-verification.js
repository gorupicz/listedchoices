import { getSession, getToken } from 'next-auth/react';
import jwt from 'jsonwebtoken'; // Import jwt to sign the token
import prisma from '@/lib/prisma';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import i18next from 'i18next';
import { sendEmail } from '@/lib/mailer';
import Backend from 'i18next-fs-backend';

// Initialize i18next with the file system backend
i18next
  .use(Backend)
  .init({
    backend: {
      loadPath: '/public/locales/{{ns}}/{{lng}}.json', // Ensure this path is correct
    },
    fallbackLng: 'en',
    preload: ['en', 'es'], // Ensure these languages are preloaded
    ns: ['register/email-verification'], // Ensure the namespace is correct
    defaultNS: 'register/email-verification',
    debug: true, // Disable debug mode to remove logs
  });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let { email, code } = req.body;

    try {

      // Fetch user from the database
      const user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        if (code) { // Check if the code is valid
          if (user.verificationCode === code) {
            await prisma.user.update({
              where: { email },
              data: { isVerified: true },
            });
            res.status(200).json({ message: 'Verification successful' });
          } else {
            res.status(400).json({ message: 'Invalid verification code' });
          }
        } else { // Send a new code
          if (user.isVerified === true) {
            res.status(400).json({ message: 'Invalid user' });
            return;
          }

          const language = req.headers['accept-language'] || 'en';
          await i18next.changeLanguage(language);
          const t = i18next.getFixedT(null, 'register/email-verification');

          const newCode = Math.floor(100000 + Math.random() * 900000).toString();
          // Save the verification code to the database
          await prisma.user.update({
            where: { email },
            data: { verificationCode: newCode },
          });

          // Use the translation function to get email subject and body
          const subject = t('verificationEmailSubject', { newCode });
          const body = t('verificationEmailBody', { newCode });

          // Send the verification email
          try {
            await sendEmail({
              to: email,
              subject,
              body,
            });
            res.status(200).json({ message: 'Verification code sent successfully' });
          } catch (error) {
            res.status(500).json({ message: 'Failed to send verification code' });
          }
        }

      } else {
        res.status(400).json({ message: 'Invalid user' });
        return;
      }
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}