import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Todo from "@/models/todo";

export async function GET() {
  await dbConnect();
  const todos = await Todo.find({}).sort({ createdAt: -1 });
  return NextResponse.json(todos);
}

export async function POST(req: Request) {
  await dbConnect();
  const body = await req.json();
  const { title, completed = false } = body;
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const todo = await Todo.create({ title, completed });
  return NextResponse.json(todo, { status: 201 });
}
