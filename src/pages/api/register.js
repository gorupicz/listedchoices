import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';
import fetch from 'node-fetch'; // Import node-fetch for server-side requests

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, first_name, last_name, subject, body, recaptchaToken } = req.body;

    // Verify reCAPTCHA
    const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=process.env.RECAPTCHA_SECRET_KEY&response=${recaptchaToken}`, // Replace with your secret key
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed.' });
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

      // Generate a verification code (6-digit random)
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Save the user and verification code to the database
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          first_name,
          last_name,
          verificationCode: code,  // Store the verification code
          isVerified: false,  // New users are not verified yet
        },
      });

      // Try sending the verification email
      try {
        await sendEmail({
          to: email,
          subject: subject.replace('{code}', code),
          body: body.replace('{code}', code),
        });
        return res.status(200).json({ message: 'User registered successfully and verification email sent.' });
      } catch (emailError) {
        console.error('Error sending verification email:', emailError);  // Log the email error
        return res.status(201).json({ message: 'User registered successfully, but email could not be sent.' });
      }

    } catch (dbError) {
      console.error('Error during registration:', dbError);  // Log the database error
      return res.status(500).json({ message: 'Internal server error during user registration.' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
