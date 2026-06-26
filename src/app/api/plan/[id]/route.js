import { getPlanById, updatePlan, deletePlan } from "@/repositories/plan.repository";
import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/api-auth";
import { getItemByPlanId } from "@/repositories/plan_item.repository";

export const GET = async (req, { params }) => {
    try {
        const resolvedParams = await params;
        const { user: decoded, error: authError } = requireApiSession(req);
        if (authError) return authError;

        const [plan, item] = await Promise.all([
            getPlanById(resolvedParams.id),
            getItemByPlanId(resolvedParams.id)

        ])

        const isOwner = decoded.isAdmin || decoded.role?.role === "owner";
        const isSameUser = plan.user?.id === decoded.id;
        const isSameArea = plan.branch?.area?.area && decoded.area?.area && plan.branch.area.area === decoded.area.area;

        if (!isOwner && !isSameUser && !isSameArea) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        return NextResponse.json({ success: true, plan, item });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
};

export const PUT = async (req) => {
    try {
        const { user: decoded, error: authError } = requireApiSession(req);
        if (authError) return authError;

        const body = await req.json();
        const { id, id_user, id_branch, ...updateData } = body;

        if (!id) {
            return NextResponse.json({ success: false, message: "Plan ID is required" }, { status: 400 });
        }

        if (id_user != decoded.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }


        const updatedPlan = await updatePlan(id, updateData);

        return NextResponse.json({
            success: true,
            message: "Plan updated successfully",
            plan: updatedPlan,
        });

    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 }
        );
    }
}

export async function DELETE(req) {
    try {
        const { user: decoded, error: authError } = requireApiSession(req);
        if (authError) return authError;

        const body = await req.json();
        const { id_plan, id_user_plan } = body;

        if (!id_plan) {
            return NextResponse.json(
                { success: false, message: "Plan ID is required" },
                { status: 400 },
            );
        }

        if (id_user_plan != decoded.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 },
            );
        }

        const reqdeletePlan = await deletePlan(id_plan);
        return NextResponse.json({
            success: true,
            message: "Plan deleted successfully",
            plan: reqdeletePlan,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 },
        );
    }
}