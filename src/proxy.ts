import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const authMiddleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    if (path.startsWith("/staff") && token?.role !== "STAFF" && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const proxy = authMiddleware;
export default authMiddleware;

export const config = {
  matcher: ["/admin/:path*", "/staff/:path*", "/client/:path*"],
};
