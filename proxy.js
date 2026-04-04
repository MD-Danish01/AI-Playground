import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default async function proxy(request) {
  const session = await auth();

  // If no session and trying to access protected route
  if (!session?.user && request.nextUrl.pathname !== "/") {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (request.nextUrl.pathname === "/" && session?.user) {
    try {
      const response = await fetch(
        `${request.nextUrl.origin}/api/chat/createNewChat`,
        {
          headers: {
            // Forward cookies so auth() inside the API route can resolve session.
            cookie: request.headers.get("cookie") || "",
          },
          cache: "no-store",
        },
      );
      const data = await response.json();
      return NextResponse.redirect(
        new URL(`/chat/${data.chatId}`, request.url),
      );
    } catch (error) {
      console.error("Error creating new chat:", error);
      return NextResponse.next();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/profile/:path*", "/chat/:path*", "/settings/:path*"],
};
