import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const isLoggedIn = request.cookies.get("session")?.value;
  const pathname = request.nextUrl.pathname;

  if (pathname === "/" && isLoggedIn) {
    return NextResponse.redirect(new URL("/destinations", request.url));
  }

  if (!(pathname === "/") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/destinations/:path*"],
};
