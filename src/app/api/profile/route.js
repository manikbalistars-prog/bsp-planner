import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { requireApiSession } from "@/lib/api-auth";

export async function PUT(req) {
  try {
    const { user: decoded, error: authError } = requireApiSession(req);
    if (authError) return authError;

    const body = await req.json();

    if (!body.password || body.password.trim() === "") {
      return NextResponse.json(
        {
          success: false,
          message: "Password is required",
        },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    const { error } = await supabase
      .from("users")
      .update({
        password: hashedPassword,
      })
      .eq("id", decoded.id); 

    if (error) throw error;

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}