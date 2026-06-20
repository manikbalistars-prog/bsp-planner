import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

import { createUser } from "@/repositories/user.repository";

export async function POST(req) {
  try {
    const body = await req.json();

    const hash = await bcrypt.hash(body.password, 10);

    const user = await createUser({
      username: body.username,
      password: hash,
      name: body.name,
      id_branch: body.id_branch ? Number(body.id_branch) : null,
      isAdmin: body.isAdmin,
      role : body.role
    });

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      {
        status: 500,
      },
    );
  }
}
