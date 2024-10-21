import bcrypt from 'bcryptjs';
import prisma from "@/lib/prisma";
import { verify } from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { token, newPassword } = req.body;

    try {
      const decoded = verify(token, process.env.JWT_SECRET);
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update the user's password in the database
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { password: hashedPassword },
      });

      return res.status(200).json({ message: 'Password successfully reset.' });

    } catch (error) {
      return res.status(400).json({ message: 'Invalid or expired token.' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
