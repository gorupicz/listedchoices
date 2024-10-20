import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, password, first_name, last_name } = req.body;

    try {
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return res.status(400).json({ message: 'User with this email already exists.' });
        }

        const created_at = new Date();
        const updated_at = new Date();
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);

      // Save the user to the database with the hashed password
      const newUser = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          first_name,
          last_name,
          created_at,
          updated_at,
        },
      });

      return res.status(201).json({ message: 'User registered successfully', newUser });

    } catch (error) {
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
