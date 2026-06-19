import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token =
    req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  const secret = new TextEncoder().encode(
    process.env.JWT_SECRET
  );

  const { payload } =
    await jwtVerify(token, secret);

  if (
    req.nextUrl.pathname.startsWith(
      "/dashboard/users"
    ) &&
    !payload.isAdmin
  ) {
    return NextResponse.redirect(
      new URL("/dashboard", req.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};