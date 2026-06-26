import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

function buildAuthError(message, status, clearSession = false) {
    const response = NextResponse.json({ success: false, message }, { status });

    if (clearSession) {
        response.cookies.set("session", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            path: "/",
            maxAge: 0,
        });
    }

    return response;
}

export function requireApiSession(req) {
    const token = req.cookies.get("session")?.value;

    if (!token) {
        return {
            user: null,
            error: buildAuthError("Unauthorized", 401),
        };
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET);
        return { user, error: null };
    } catch (error) {
        return {
            user: null,
            error: buildAuthError("Invalid or expired session", 401, true),
        };
    }
}

export function requireApiAdmin(req) {
    const auth = requireApiSession(req);
    if (auth.error) return auth;

    if (!auth.user?.isAdmin) {
        return {
            user: null,
            error: buildAuthError("Forbidden bruh! only admin", 403),
        };
    }

    return auth;
}
