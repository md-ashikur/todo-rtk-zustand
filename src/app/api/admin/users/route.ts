import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/users";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const users = await User.find({}, "_id name email role");
  return NextResponse.json(users);
}
