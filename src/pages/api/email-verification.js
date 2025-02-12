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
      loadPath: './public/locales/{{ns}}/{{lng}}.json', // Adjusted path
    },
    fallbackLng: 'en',
    preload: ['en', 'es'], // Preload the languages you need
    ns: ['register/email-verification'], // Specify the namespace
    defaultNS: 'register/email-verification',
    debug: false, // Enable debug mode to see more logs
  });

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let { email, code } = req.body;

    try {
      // Decode the email and replace spaces with '+'
      email = decodeURIComponent(email).replace(/ /g, '+');

      // Fetch user from the database
      const user = await prisma.user.findUnique({ where: { email } });

      if (user) {
        if (code) {//Check if the code is valid
          if (user.verificationCode === code) {
            await prisma.user.update({
              where: { email },
              data: { isVerified: true },
            });
            res.status(200).json({ message: 'Verification successful' });
          } else {
            res.status(400).json({ message: 'Invalid verification code' });
          }
        } else {//Send a new code
          if (user.isVerified === true) {
            res.status(400).json({ message: 'Invalid user' });
            return;
          }

          console.log('No code provided, generating a new one.');
            
          const language = req.headers['accept-language'] || 'en';
          console.log('Language set to:', language);
          await i18next.changeLanguage(language);
          const t = i18next.getFixedT(null, 'register/email-verification');

          console.log('Current language:', language);
          console.log('Namespace:', 'register/email-verification');

          const newCode = Math.floor(100000 + Math.random() * 900000).toString();
          console.log('Generated verification code:', newCode);
          // Save the verification code to the database
          await prisma.user.update({
            where: { email },
            data: { verificationCode: newCode },
          });
          console.log('Verification code saved to database.');

          // Use the translation function to get email subject and body
          const subject = t('verificationEmailSubject', { newCode });
          const body = t('verificationEmailBody', { newCode });
          console.log('Email subject:', subject);
          console.log('Email body:', body);

          // Send the verification email
          try {
            await sendEmail({
              to: email,
              subject,
              body,
            });
            console.log('Verification email sent successfully.');
            res.status(200).json({ message: 'Verification code sent successfully' });
          } catch (error) {
            console.error('Error sending verification email:', error);
            res.status(500).json({ message: 'Failed to send verification code' });
          }
        }

      } else {
        res.status(400).json({ message: 'Invalid user' });
        return;
      }
    } catch (error) {
      console.error('Error during verification:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}