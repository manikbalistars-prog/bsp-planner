import { updatePlan } from "@/repositories/plan.repository";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
export const PUT = async (req) => {
    try {

        const token = req.cookies.get("session")?.value;
        if (!token) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        try {
            jwt.verify(token, process.env.JWT_SECRET);
        } catch (error) {
            return NextResponse.json({ success: false, message: "Invalid session" }, { status: 401 });
        }

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