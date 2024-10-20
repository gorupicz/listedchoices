import bcrypt from 'bcryptjs';
import prisma from "@/lib/prisma";
import { sign } from 'jsonwebtoken';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password } = req.body;

    try {
      // Fetch user from the database by email
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

      // Generate a token (optional)
      const token = sign(
        { userId: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: '72h' }
      );

      // Return success and the token (or session)
      return res.status(200).json({ message: 'Login successful', token });

    } catch (error) {
      console.error('Error during login:', error);  // Log the error
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
