import { getToken } from 'next-auth/jwt';
import prisma from '@/lib/prisma';
import aws from 'aws-sdk';
import formidable from 'formidable';
import fs from 'fs';

aws.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
});

const s3 = new aws.S3();

export const config = {
  api: {
    bodyParser: false, // Disable Next.js's default body parser
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Formidable error:', err);
        return res.status(500).json({ error: 'Error parsing form data' });
      }

      const userId = parseInt(fields.userId, 10);
      const photo = Array.isArray(files.photo) ? files.photo[0] : files.photo;

      if (!photo) {
        return res.status(400).json({ error: 'Photo is required' });
      }

      console.log('Parsed file:', photo);

      try {
        await prisma.user.update({
          where: { id: userId },
          data: { idPhotograph: photo.originalFilename },
        });

        const params = {
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: `user-photos/${userId}/${Date.now()}-${photo.originalFilename}`,
          Body: fs.createReadStream(photo.filepath),
          ContentType: photo.mimetype,
        };

        const data = await s3.upload(params).promise();

        // Send a response indicating the ID verification is in progress
        res.status(200).json({ message: 'Photo uploaded successfully', idVerificationInProgress: true });
      } catch (error) {
        console.error('Error during database update or S3 upload:', error);
        res.status(500).json({ error: 'Error uploading photo' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
} 