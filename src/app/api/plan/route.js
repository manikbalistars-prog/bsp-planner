import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";


import { createPlan, getAllPlans } from "@/repositories/plan.repository";

export const POST = async (req) => {
    try {
        const token = req.cookies.get("session")?.value;

        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        let payload;

        try {
            payload = jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json(
                { success: false, message: "Invalid or expired session" },
                { status: 401 }
            );
        }

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

        const token = req.cookies.get("session")?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

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

