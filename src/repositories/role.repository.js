import { supabase } from "@/lib/supabase";

export async function getAllRole() {
    const { data, error } = await supabase.from("role")
        .select("id, role")
        .order("role", { ascending: true });
    if (error) throw new Error(error.message)
    return data
}