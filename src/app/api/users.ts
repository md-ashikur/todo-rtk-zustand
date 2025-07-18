/* eslint-disable @typescript-eslint/no-unused-vars */
// pages/api/users.ts
import { NextApiRequest, NextApiResponse } from 'next';
import { connectToDatabase } from '@/lib/mongoose';
import User from '../../models/users';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await connectToDatabase();

  if (req.method === 'POST') {
    const { name, email } = req.body;
    try {
      const user = await User.create({ name, email });
      return res.status(201).json(user);
    } catch (err) {
      return res.status(400).json({ error: 'Failed to create user' });
    }
  } else if (req.method === 'GET') {
    const users = await User.find();
    return res.status(200).json(users);
  } else {
    res.setHeader('Allow', ['GET', 'POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
