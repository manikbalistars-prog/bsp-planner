import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function GET() {
  try {
    const token = cookies().get("session")?.value;

    if (!token) {
      return NextResponse.json(
        { user: null },
        { status: 401 }
      );
    }

    const user = jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.json({
      user,
    });
  } catch (err) {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }
}