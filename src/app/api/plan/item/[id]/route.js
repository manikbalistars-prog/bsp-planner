import { deleteItem, updateItem, getPlanItemForValidation } from "@/repositories/plan_item.repository";
import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/api-auth";
import { recalculateAndSavePlanPoints } from "@/repositories/plan.repository";



export const PUT = async (req) => {
    try {
        const { user: decoded, error: authError } = requireApiSession(req)
        if (authError) return authError

        const body = await req.json()
        const { id, id_user_plan, ...data } = body

        if (!id) {
            return NextResponse.json({ success: false, message: "Item ID is required" }, { status: 400 });
        }
        if (id_user_plan != decoded.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }
        const oldItem = await getPlanItemForValidation(id);
        if (!oldItem) {
            return NextResponse.json({ success: false, message: "Item not found" }, { status: 404 });
        }

        const updateResult = await updateItem(id, data)

        const isStatusChanged = data.status !== undefined && oldItem.status !== data.status;
        const isNoteChanged = data.after_note !== undefined && oldItem.after_note !== data.after_note;

        if (isStatusChanged || isNoteChanged) {
            await recalculateAndSavePlanPoints(oldItem.id_plan);
        }


        return NextResponse.json({
            success: true,
            message: "Item updated successfully",
            item: updateResult,
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
        const { id, id_user_plan } = body;

        if (!id) {
            return NextResponse.json(
                { success: false, message: "Item ID is required" },
                { status: 400 },
            );
        }

        if (id_user_plan != decoded.id) {
            return NextResponse.json(
                { success: false, message: "Unauthorized" },
                { status: 401 },
            );
        }

        const oldItem = await getPlanItemForValidation(id);
        if (!oldItem) {
            return NextResponse.json(
                { success: false, message: "Item not found" },
                { status: 404 },
            );
        }

        const reqdeleteItem = await deleteItem(id);

        await recalculateAndSavePlanPoints(oldItem.id_plan);
        return NextResponse.json({
            success: true,
            message: "Item deleted successfully",
            plan: reqdeleteItem,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, message: error.message },
            { status: 500 },
        );
    }
}