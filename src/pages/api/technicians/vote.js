import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { id, type } = req.body;

    if (!['up', 'down'].includes(type)) {
      return res.status(400).json({ error: 'Invalid vote type' });
    }

    try {
      const updateData = type === 'up' ? { upvotes: { increment: 1 } } : { downvotes: { increment: 1 } };

      const technician = await prisma.technician.update({
        where: { id },
        data: updateData,
      });

      res.status(200).json(technician);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update votes' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}