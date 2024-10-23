export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, code } = req.body;

    try {
      // Verification logic (fetch user and compare the code)
      
      // Example:
      const user = await prisma.user.findUnique({ where: { email } });
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
      res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}