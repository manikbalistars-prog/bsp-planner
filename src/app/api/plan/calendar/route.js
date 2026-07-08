import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/api-auth";
import { getPlansByMonth } from "@/repository/plan"; // <-- import

export const GET = async (req) => {
  try {
    const { user: decoded, error: authError } = requireApiSession(req);
    if (authError) return authError;

    const { searchParams } = new URL(req.url);

    const now = new Date();

    const month = Number(searchParams.get("month")) || now.getMonth() + 1;

    const year = Number(searchParams.get("year")) || now.getFullYear();

    const startDate = `${year}-${String(month).padStart(2, "0")}-01`;

    const endDate = new Date(year, month, 0).toISOString().split("T")[0];

    const result = await getPlansByMonth({
      showAll: decoded.isAdmin || decoded.role?.role === "owner",
      areaGroup: true,
      id_user: decoded.id,
      area: decoded.area?.area,
      startDate,
      endDate,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: err.message,
      },
      { status: 500 },
    );
  }
};
