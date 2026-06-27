import { supabase } from "@/lib/supabase";

export const getDashboardBranch = async (month, year) => {
    const { data, error } = await supabase.rpc("dashboard_branch", {
        p_month: month,
        p_year: year,
    });

    if (error) throw error;

    return data;
};

export const getDashboardArea = async (month, year) => {
    const { data, error } = await supabase.rpc("dashboard_area", {
        p_month: month,
        p_year: year,
    });

    if (error) throw error;

    return data;
};