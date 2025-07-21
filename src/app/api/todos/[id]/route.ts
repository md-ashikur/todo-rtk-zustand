import { NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import Todo from "@/models/todo";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const todo = await Todo.findById(params.id);
  if (!todo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }
  return NextResponse.json(todo);
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const body = await req.json();
  const { title, completed } = body;
  const todo = await Todo.findByIdAndUpdate(
    params.id,
    { ...(title && { title }), ...(completed !== undefined && { completed }) },
    { new: true }
  );
  if (!todo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }
  return NextResponse.json(todo);
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  const todo = await Todo.findByIdAndDelete(params.id);
  if (!todo) {
    return NextResponse.json({ error: "Todo not found" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
