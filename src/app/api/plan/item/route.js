import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/api-auth";

import { createPlanItem } from "@/repositories/plan_item.repository";
import { getPlanById } from "@/repositories/plan.repository";

export const POST = async (req) => {
    try {
        const { user: user, error: authError } = requireApiSession(req);
        if (authError) return authError;

        const payload = await req.json()
        const { id_plan, description, time, status = "pending" } = payload

        if (!id_plan || !description || !time) {
            return NextResponse.json({ success: false, message: "Plan ID, time, and description are required" }, { status: 400 });
        }

        const plan = await getPlanById(id_plan)

        if (user.id != plan?.user?.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const item = await createPlanItem({
            id_plan,
            description,
            time,
            status,
        })
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