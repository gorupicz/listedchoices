import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, code, subject, body } = req.body;

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
          const verificationCode = code || Math.floor(100000 + Math.random() * 900000).toString();

          // Update the user's verification code in the database
          await prisma.user.update({
            where: { email },
            data: { verificationCode: verificationCode },
          });

          // Send verification email
          await sendEmail({
            to: email,
            subject: subject,
            body: body.replace('{code}', verificationCode),  // Format the email body
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
      console.error('Error during login:', dbError);  // Log the database error
      return res.status(500).json({ message: 'Internal server error during login.' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
