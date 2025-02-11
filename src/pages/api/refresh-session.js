import { getSession } from "next-auth/react";

export default async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    // Invalidate session cache or perform any necessary actions
    res.status(200).json({ message: "Session refreshed" });
  } else {
    res.status(401).json({ message: "Not authenticated" });
  }
}; 