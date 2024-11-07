export default async function handler(req, res) {
  if (req.method === 'POST') {
    let { email, code } = req.body;

    try {
      // Decode the email and replace spaces with '+'
      email = decodeURIComponent(email).replace(/ /g, '+');

      // Fetch user from the database
      const user = await prisma.user.findUnique({ where: { email } });

      // Log the retrieved user and verification code

      if (user && user.verificationCode === code) {
        // Mark user as verified
        await prisma.user.update({
          where: { email },
          data: { isVerified: true },
        });

        res.status(200).json({ message: 'Verification successful' });
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