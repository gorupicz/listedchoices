import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  

  const { propertyId, userId } = req.body;

  if (!propertyId || !userId) {
    console.error('No propertyId or userId found');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const existingRequest = await prisma.propertyFollowRequest.findFirst({
      where: {
        requesterId: userId,
        propertyId,
      },
    });

    if (existingRequest) {
            await prisma.propertyFollowRequest.update({
                where: { id: existingRequest.id },
                data: { currentStatus: 'PENDING' },
            });
    } else {
      const newRequest = await prisma.propertyFollowRequest.create({
        data: {
          requesterId: userId,
          propertyId,
          currentStatus: 'PENDING',
        },
      });

      await prisma.propertyFollowRequestHistory.create({
        data: {
          followRequestId: newRequest.id,
          status: 'PENDING',
          changedByUserId: userId,
        },
      });
    }

    res.status(200).json({ message: 'Follow request sent' });
  } catch (error) {
    console.error('Error processing follow request:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
} 