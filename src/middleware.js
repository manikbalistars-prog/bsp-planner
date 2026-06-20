import { jwtVerify } from "jose";
import { NextResponse } from "next/server";

export async function middleware(req) {
  const token = req.cookies.get("session")?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }

  try {
    const secret = new TextEncoder().encode(
      process.env.JWT_SECRET
    );

    const { payload } = await jwtVerify(
      token,
      secret
    );

   if (req.nextUrl.pathname.startsWith("/user") && !payload.isAdmin) {
      
      const redirectUrl = new URL("/dashboard", req.url);

      redirectUrl.searchParams.set("error", "unauthorized");

      return NextResponse.redirect(redirectUrl);
    }


    return NextResponse.next();
  } catch (err) {
    console.error("JWT ERROR:", err);

    return NextResponse.redirect(
      new URL("/login", req.url)
    );
  }
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/planner/:path*",
    "/user/:path*",
  ],
};