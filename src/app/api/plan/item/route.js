import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/api-auth";

import { createPlanItem } from "@/repositories/plan_item.repository";

export const POST = async (req) => {
    try {
        const { user: user, error: authError } = requireApiSession(req);
        if (authError) return authError;

        const payload = await req.json()

        if (user.id != payload.id_user_plan) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const item = await createPlanItem(payload)
        return NextResponse.json({
            success: true,
            item
        })

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}