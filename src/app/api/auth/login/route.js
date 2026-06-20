import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { findUserByUsername } from "@/repositories/user.repository";

export async function POST(req) {
  try {
    const { username, password } =
      await req.json();

    const user =
      await findUserByUsername(username);

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "User Not Found",
        },
        { status: 401 }
      );
    }

    // console.log(user)

    const valid =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!valid) {
      return NextResponse.json(
        {
          success: false,
          message: "Password is wrong bruh!",
        },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        id_branch: user.id_branch,
        isAdmin: user.isAdmin,
        id_role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    const response =
      NextResponse.json({
        success: true,
      });

    response.cookies.set(
      "session",
      token,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "strict",
        path: "/",
        maxAge:
          60 * 60 * 24 * 7,
      }
    );

    return response;
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      }
    );
  }
}