import prisma from '@/lib/prisma';
import { sendRecoveryEmail } from '@/lib/mailer';
import loginData from '@/data/login/index.json'; // Import recovery email texts

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email } = req.body;

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
      const recoveryToken = 'generated-recovery-token'; // Replace with your token logic
      console.log('Generated token:', recoveryToken);

      // Send recovery email
      try {
        await sendRecoveryEmail(email, recoveryToken, loginData);
        console.log('Recovery email sent successfully to:', email);
        return res.status(200).json({ message: loginData.passwordRecoverySentMessage });
      } catch (emailError) {
        console.error('Error sending recovery email:', emailError);
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
