import prisma from '@/lib/prisma';
import { sendEmail } from '@/lib/mailer';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    let { email, code, subject, body } = req.body;

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

          const newCode = Math.floor(100000 + Math.random() * 900000).toString();
          // Save the verification code to the database
          await prisma.user.update({
            where: { email },
            data: { verificationCode: newCode },
          });

          // Replace {{newCode}} in subject and body with the asctual code
          subject = subject.replace('{{newCode}}', newCode);
          body = body.replace('{{newCode}}', newCode);

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