import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default async function proxy(request) {
  const session = await auth();

  // If no session and trying to access protected route
  if (!session?.user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/chat/:path*", "/settings/:path*"]
};
