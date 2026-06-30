import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/api-auth";
import { use } from "react";

export async function GET(req) {
  const { user, error } = requireApiSession(req);
  if (error) {
    return NextResponse.json(
      { user: null },
      { status: 401 }
    );
  }

  return NextResponse.json({
    user,
  });
}