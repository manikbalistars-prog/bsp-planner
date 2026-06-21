import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { findUserByUsername } from "@/repositories/user.repository";

export async function PUT(req, { params }) {
  try {
    
    const token = req.cookies.get("session")?.value;
    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

   
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.isAdmin) {
      return NextResponse.json({ success: false, message: "Forbidden bruh!" }, { status: 403 });
    }

    const { id } = await params; 
    const body = await req.json();

   
    const existingUser = await findUserByUsername(body.username);
    if (existingUser && existingUser.id !== Number(id)) {
      return NextResponse.json({ 
        success: false, 
        message: `Username "${body.username}" already exist!` 
      }, { status: 400 });
    }

    
    const updateData = {
      username: body.username,
      name: body.name,
      id_branch: body.id_branch ? Number(body.id_branch) : null,
      id_role: body.id_role,
      isAdmin: body.isAdmin,
    };

    
    if (body.password && body.password.trim() !== "") {
      updateData.password = await bcrypt.hash(body.password, 10);
    }

   
    const { data, error } = await supabase
      .from("users")
      .update(updateData)
      .eq("id", Number(id))
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ success: true, data });
  } catch (err) {
    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }
    console.error("🔥 Error update user:", err);
    return NextResponse.json({ success: false, message: err.message || "Internal Server Error" }, { status: 500 });
  }
}