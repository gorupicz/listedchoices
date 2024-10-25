import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';
import fetch from 'node-fetch'; // Import node-fetch for server-side requests

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, subject, body, recaptchaToken } = req.body;

    // Verify reCAPTCHA
    const recaptchaResponse = await fetch(`https://www.google.com/recaptcha/api/siteverify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `secret=RECAPTCHA_SECRET_KEY&response=${recaptchaToken}`, // Replace with your secret key
    });

    const recaptchaData = await recaptchaResponse.json();

    if (!recaptchaData.success) {
      return res.status(400).json({ message: 'reCAPTCHA verification failed.' });
    }

    try {
      // Fetch the user from the database by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // Check if the password is correct
      const isPasswordValid = await bcrypt.compare(password, user.password);

      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Invalid email or password' });
      }

      // If the user is not verified, send a new verification code
      if (!user.isVerified) {
        try {
          // Generate a verification code if not provided in the request
          const code = Math.floor(100000 + Math.random() * 900000).toString();

          // Update the user's verification code in the database
          await prisma.user.update({
            where: { email },
            data: { verificationCode: code },
          });

          // Send verification email
          await sendEmail({
            to: email,
            subject: subject.replace('{code}', code),
            body: body.replace('{code}', code),  // Format the email body
          });

          return res.status(201).json({ message: 'Email not verified, verification email sent', isVerified: false });
        } catch (emailError) {
          console.error('Error sending verification email:', emailError);
          return res.status(201).json({ message: 'Email not verified, but verification email could not be sent', isVerified: false });
        }
      }

      // If the user is verified, proceed with login
      const token = sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '72h' }
      );

      return res.status(200).json({ message: 'Login successful', token, isVerified: true });

    } catch (dbError) {
      console.error('Error during login:', dbError);
      return res.status(500).json({ message: 'Internal server error during login.' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
