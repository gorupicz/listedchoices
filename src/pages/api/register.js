import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';
import fetch from 'node-fetch'; // Import node-fetch for server-side requests
import Cookies from 'js-cookie';


export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, first_name, last_name, recaptchaToken } = req.body;

    // Extract the Accept-Language header from the incoming request
    const acceptLanguage = req.headers['accept-language'] || 'en';

    // Verify reCAPTCHA
    const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept-Language': Cookies.get('i18next') || 'en',
      },
      body: `secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${recaptchaToken}`, // Correctly access the secret key
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success || recaptchaData.score < 0.5) { // Check for success and score
      return res.status(400).json({ message: 'reCAPTCHA verification failed. Please try again.' });
    }

    try {
      // Check if the user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists.' });
      }

      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save the user to the database
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          first_name,
          last_name,
        },
      });

      // Send a response with the redirect URL
      res.status(200).json({ message: 'User registered successfully.' });

    } catch (dbError) {
      console.error('Error during registration:', dbError);
      return res.status(500).json({ message: 'Internal server error during user registration.' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
