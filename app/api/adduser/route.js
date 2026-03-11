import { NextResponse } from "next/server";
import connectDB from "@/lib/connectdb";
import userSchema from "@/models/user.schema";

export async function POST(requst) {
  await connectDB();

  const { username, email } = await requst.json();

  const User = await userSchema.create({
    username,
    email,
  });

  return NextResponse.json({ success: true, data: User }, { status: 201 });
}
