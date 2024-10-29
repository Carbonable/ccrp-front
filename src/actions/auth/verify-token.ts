import type { NextApiRequest, NextApiResponse } from 'next';
import { verify } from 'jsonwebtoken';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({ message: 'No token provided' });
  }

  try {
    const decoded = verify(token, process.env.JWT_SECRET!);
    res.status(200).json(decoded);
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
}
