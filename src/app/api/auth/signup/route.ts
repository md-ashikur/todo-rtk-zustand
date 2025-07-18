import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import type { MongoClient } from 'mongodb';
import { hash } from 'bcryptjs';

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: 'Email and password required.' }, { status: 400 });
  }
  const client: MongoClient = await clientPromise;
  const usersCollection = client.db().collection('users');
  const existing = await usersCollection.findOne({ email });
  if (existing) {
    return NextResponse.json({ error: 'User already exists.' }, { status: 400 });
  }
  const hashed = await hash(password, 10);
  await usersCollection.insertOne({ email, password: hashed });
  return NextResponse.json({ success: true });
}
