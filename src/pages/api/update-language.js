import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { language } = req.body;
    const session = await getSession({ req });

    if (session) {
      // Update the session with the new language
      session.language = language;
      // Save the session (implementation depends on your session management)
      // e.g., saveSession(session);

      res.status(200).json({ message: 'Language updated' });
    } else {
      res.status(401).json({ message: 'Not authenticated' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
} 