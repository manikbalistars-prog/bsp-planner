import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/api-auth";

import { createPlan, getAllPlans } from "@/repositories/plan.repository";

export const POST = async (req) => {
    try {
        const { user: payload, error: authError } = requireApiSession(req);
        if (authError) return authError;

        const body = await req.json();

        const planData = {
            ...body,
            id_user: payload.id || null,
            id_branch: payload.branch?.id || null
        };

        const plan = await createPlan(planData);

        return NextResponse.json({
            success: true,
            plan,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export const GET = async (req) => {
    try {
        const { user: decoded, error: authError } = requireApiSession(req);
        if (authError) return authError;

        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10;
        const search = searchParams.get("search") || "";

        const showAll =
            decoded.isAdmin || decoded.role?.role === "owner";

        const result = await getAllPlans({
            page,
            limit,
            search,
            showAll,
            areaGroup : true,
            id_user: decoded.id,
            area: decoded.area?.area
        });

        return NextResponse.json({ success: true, ...result });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

