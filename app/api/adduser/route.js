import { NextResponse } from "next/server";
import connectDB from "@/lib/connectdb";
import userSchema from "@/models/user.schema";

export async function POST(request) {
  await connectDB();

  const token = request.cookies.get('token')?.value || ''
  console.log('Received token:', token);

  const { username, email } = await request.json();

  const User = await userSchema.create({
    username,
    email,
  });

  return NextResponse.json({ success: true, data: User }, { status: 201 });
}
