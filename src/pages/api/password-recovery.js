import jwt from 'jsonwebtoken';
import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, subject, body } = req.body;

    try {
      // Log to check if the email is coming through
      console.log('Attempting password recovery for:', email);

      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        console.log('User not found. Returning generic message');
        return res.status(200).json({ message: loginData.passwordRecoverySentMessage }); // Always return success message even if email doesn't exist for security reasons
      }

      // Generate token (e.g., JWT or any token logic for password recovery)
      const recoveryToken = jwt.sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }  // Token will expire in 1 hour
      );
      const recoveryLink = `${process.env.NEXT_PUBLIC_BASE_URL}/login/password-reset?token=${recoveryToken}`;
      
      // Send recovery email
      try {
        await await sendEmail({
          to: email,
          subject,
          body: body.replace('{link}', recoveryLink),
        });
        console.log('Recovery email sent successfully to:', email);
        return res.status(200).json({ message: loginData.passwordRecoverySentMessage });
      } catch (error) {
        console.error('Error sending recovery email:', error);
        return res.status(500).json({ message: 'Error sending email. Please try again.' });
      }

    } catch (error) {
      console.error('Error during password recovery:', error);
      return res.status(500).json({ message: loginData.defaultErrorMessage });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
