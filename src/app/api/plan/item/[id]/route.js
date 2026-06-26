import { deleteItem, updateItem } from "@/repositories/plan_item.repository";
import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/api-auth";


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

        const updateResult = await updateItem(id, data)


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

        const reqdeleteItem = await deleteItem(id);
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