
import { NextResponse } from "next/server";
import { getUsersPaginated, createUser, findUserByUsername, getUsers } from "@/repositories/user.repository";
import bcrypt from "bcryptjs";
import { requireApiAdmin, requireApiSession } from "@/lib/api-auth";

export async function GET(req) {
  try {
    const { user, error: authError } = requireApiSession(req);
    if (authError) return authError;
    const { searchParams } = new URL(req.url);
    const all = searchParams.get("all") === "true";

    if (all) {
      const users = await getUsers(user.area?.id || null);

      return NextResponse.json({
        success: true,
        users,
      });
    }


    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 50;
    const search = searchParams.get("search") || "";

    const result = await getUsersPaginated({ page, limit, search });

    return NextResponse.json({ success: true, ...result });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { error: authError } = requireApiAdmin(req);
    if (authError) return authError;

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
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}
