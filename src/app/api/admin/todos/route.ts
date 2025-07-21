import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Todo from "@/models/todo";
import User from "@/models/users";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const todos = await Todo.find({}).populate("user", "_id name email role");
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  await dbConnect();
  const session = await getServerSession(authOptions);
  if (!session || !session.user || (session.user as { role?: string }).role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const { title, completed, userId } = body;
  if (!title || typeof completed !== "boolean" || !userId) {
    return NextResponse.json({ error: "Invalid data" }, { status: 400 });
  }
  const todo = await Todo.create({
    title,
    completed,
    user: userId,
  });
  return NextResponse.json(todo, { status: 201 });
}
