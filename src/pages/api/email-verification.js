import { getSession, getToken } from 'next-auth/react';
import jwt from 'jsonwebtoken'; // Import jwt to sign the token
import prisma from '@/lib/prisma';
import Cookies from 'js-cookie';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let { email, code } = req.body;

    try {
      // Decode the email and replace spaces with '+'
      email = decodeURIComponent(email).replace(/ /g, '+');

      // Fetch user from the database
      const user = await prisma.user.findUnique({ where: { email } });

      if (user && user.verificationCode === code) {
        // Mark user as verified
        await prisma.user.update({
          where: { email },
          data: { isVerified: true },
        });

        // Create a session token for the user
        const token = jwt.sign(
          {
            id: user.id,
            email: user.email,
            isVerified: true,
          },
          process.env.NEXTAUTH_SECRET,
          { expiresIn: '72h' } // Set token expiration as needed
        );

        console.log('Generated JWT:', token);

        // Set the session token as a cookie using js-cookie
        res.setHeader('Set-Cookie', `next-auth.session-token=${token}; Max-Age=${60 * 60 * 24}; Path=/; HttpOnly; Secure; SameSite=Lax`);

        res.status(200).json({ message: 'Verification successful and user authenticated' });
      } else {
        res.status(400).json({ message: 'Invalid verification code' });
      }
    } catch (error) {
      console.error('Error during verification:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}