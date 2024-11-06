import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  
  const { propertyId, userId, followRequestStatus } = req.body;

  if (!propertyId || !userId) {
    console.error('No propertyId or userId found');
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const newStatus = followRequestStatus === 'ACCEPTED' ? 'UNFOLLOWED' : 'WITHDRAWN';

  try {
    const followRequest = await prisma.propertyFollowRequest.findFirst({
      where: {
        requesterId: userId,
        propertyId,
      },
    });

    if (followRequest) {
      await prisma.propertyFollowRequest.update({
        where: { id: followRequest.id },
        data: { currentStatus: newStatus },
      });

      await prisma.propertyFollowRequestHistory.create({
        data: {
          followRequestId: followRequest.id,
          status: newStatus,
          changedByUserId: userId,
        },
      });

      res.status(200).json({ message: 'Follow status updated', newStatus: newStatus });
    } else {
      res.status(404).json({ message: 'Follow request not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Internal server error' });
  }
} 