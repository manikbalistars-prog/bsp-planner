import { supabase } from "@/lib/supabase";

export const getDashboardBranch = async (month, year) => {
    const effectiveDay = await getEffectiveDay(month, year);

    const { data, error } = await supabase.rpc("dashboard_branch", {
        p_month: month,
        p_year: year,
        p_effective_day: effectiveDay,
    });

    if (error) throw error;

    return { data, efective_day: effectiveDay };
};

export const getDashboardArea = async (month, year) => {
    const { data, error } = await supabase.rpc("dashboard_area", {
        p_month: month,
        p_year: year,
    });

    if (error) throw error;

    return data;
};


const getEffectiveDay = async (month, year) => {
    const { data, error } = await supabase
        .from("effective_day")
        .select("*")
        .eq("month", month)
        .eq("year", year)
        .single();

    if (error) throw error;

    if (!data) {
        throw new Error(
            `Effective day belum dikonfigurasi untuk ${month}/${year}`
        );
    }

    if (data.is_locked) {
        return data.total_day;
    }

    const today = new Date();

    if (
        today.getMonth() + 1 === month &&
        today.getFullYear() === year
    ) {
        return today.getDate();
    }

    return data.total_day;
};