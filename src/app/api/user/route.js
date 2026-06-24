
import { NextResponse } from "next/server";
import { getUsersPaginated, createUser, findUserByUsername } from "@/repositories/user.repository";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const search = searchParams.get("search") || "";

    const result = await getUsersPaginated({ page, limit, search });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const token = req.cookies.get("session")?.value

    if (!token) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);


    if (!decoded.isAdmin) {
      return NextResponse.json({ success: false, message: "Forbidden bruh! only admin" }, { status: 403 });
    }
    const body = await req.json();

    const existingUser = await findUserByUsername(body.username);
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: `Username "${body.username}" already exist!`
      }, { status: 400 });
    }

    const hash = await bcrypt.hash(body.password, 10);

    const user = await createUser({
      username: body.username,
      password: hash,
      name: body.name,
      id_branch: body.id_branch ? Number(body.id_branch) : null,
      isAdmin: body.isAdmin,
      id_role: body.id_role,
      isDelete: body.isDelete
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (err) {

    if (err.name === "JsonWebTokenError" || err.name === "TokenExpiredError") {
      return NextResponse.json({ success: false, message: "Invalid or expired token" }, { status: 401 });
    }
    // console.error("Error create user:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
