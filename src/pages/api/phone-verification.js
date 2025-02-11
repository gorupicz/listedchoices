import { getSession } from 'next-auth/react';
import prisma from '@/lib/prisma';
import twilio from 'twilio'; // Import Twilio

export default async function handler(req, res) {

  if (req.method === 'POST') {
    const { phoneNumber, userId, code } = req.body;
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const client = twilio(accountSid, authToken);

    if (code) {
      const user = await prisma.user.findUnique({
        where: { id: userId },
      });
      console.log('User:', user);
      if (!user) {
        return res.status(404).json({ error: 'No user found with the given email' });

      }

      // Validate the verification code
      const verificationCheck = await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({
          code: code,
          verificationSid: user.phoneVerificationSID,
        });
      await prisma.user.update({
        where: { id: userId },
        data: { 
          phoneIsVerified: verificationCheck.status,
        },
      });
      if (verificationCheck.status === 'approved') {
        // Update the session with the new phoneIsVerified
        const session = await getSession({ req });
        if (session) {
          session.user.phoneIsVerified = verificationCheck.status;
        }
        return res.status(200).json({ message: 'Phone number verified successfully' });
      } else {
        return res.status(400).json({ error: 'Invalid verification code' });
      }
    } else {
      if (!phoneNumber) {
        return res.status(400).json({ error: 'Phone number is required' });
      }
      try {
        // Update the user's phone_number in the database
        await prisma.user.update({
          where: { id: userId },
          data: { phone_number: phoneNumber },
        });

        const verification = await client.verify.v2
          .services(process.env.TWILIO_VERIFY_SERVICE_SID)
          .verifications.create({
            channel: "sms",
            to: `+${phoneNumber}`,
          });

        if (verification.status === 'pending') {
          await prisma.user.update({
            where: { id: userId },
            data: { 
              phoneVerificationSID: verification.sid
            },
          });
        }
        console.log(verification.sid);
        return res.status(200).json({ message: 'Verification code sent and phone number saved' });
      } catch (error) {
        console.error('Error during phone verification:', error);
        return res.status(500).json({ error: 'Failed to send verification code' });
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
} 
