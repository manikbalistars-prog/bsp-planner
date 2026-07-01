import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/api-auth";

import { createPlanItem, getAllPlanItems } from "@/repositories/plan_item.repository";
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


export const GET = async (req) => {
    try {
       
        const { user: decoded, error: authError } = requireApiSession(req);
        if (authError) return authError;

        const { searchParams } = new URL(req.url);
        const page = Number(searchParams.get("page")) || 1;
        const limit = Number(searchParams.get("limit")) || 10;
        const status = searchParams.get("status") || undefined;

        const from = (page - 1) * limit;
        const to = from + limit - 1;

        const showAll = decoded.isAdmin || decoded.role?.role === "owner";
        const userAreaId = decoded.area?.id;

       
        const { data, count } = await getAllPlanItems({
            from,
            to,
            showAll,
            userAreaId,
            status
        });

        return NextResponse.json({
            success: true,
            data,
            totalData: count,
            page,
            totalPages: Math.ceil(count / limit)
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}