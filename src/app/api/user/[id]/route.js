import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabase } from "@/lib/supabase";
import { findUserByUsername } from "@/repositories/user.repository";
import { requireApiAdmin } from "@/lib/api-auth";

export async function PUT(req, { params }) {
  try {
    const { error: authError } = requireApiAdmin(req);
    if (authError) return authError;

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
    return NextResponse.json({ success: false, message: err.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const { error: authError } = requireApiAdmin(req);
    if (authError) return authError;

    const { id } = await params; 
    const { data, error } = await supabase
      .from("users")
      .update({ isDelete: true })
      .eq("id", Number(id))
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ 
      success: true, 
      message: "User deleted successfully (Soft Delete)",
      data 
    });
  } catch (err) {
    return NextResponse.json({ success: false, message: err.message || "Internal Server Error" }, { status: 500 });
  }
}