import { NextResponse } from "next/server";
import { dashboardBranchService } from "@/services/dashboard.service";

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url);

        const now = new Date();

        const month =
            Number(searchParams.get("month")) ||
            now.getMonth() + 1;

        const year =
            Number(searchParams.get("year")) ||
            now.getFullYear();

        const data = await dashboardBranchService(month, year);

        return NextResponse.json({
            success: true,
            data,
        });
    } catch (err) {
        return NextResponse.json(
            {
                success: false,
                message: err.message,
            },
            { status: 500 }
        );
    }
}