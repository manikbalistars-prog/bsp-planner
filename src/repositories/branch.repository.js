import { supabase } from "@/lib/supabase";

export async function getAllBranches() {
    const { data, error } = await supabase.from("branch")
        .select("id, name")
        .order("name", { ascending: true });
    if (error) throw new Error(error.message)
    return data
}