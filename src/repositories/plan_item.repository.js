import { supabase } from "@/lib/supabase";


export const createPlanItem = async (payload) => {
    const { data, error } = await supabase.from('plan_item').insert(payload).select().single()
    if (error) throw error
    return data
}


export const getItemByPlanId = async (id) => {
    const { data, error } = await supabase.from('plan_item').select(
        `*,
        plan_images (
                id,
                created_at,
                id_item,
                image_path,
                image_type
            )`
    ).eq('id_plan', id).order('time', { ascending: true })

    if (error) throw error
    return data
}

export const updateItem = async (id, updateData) => {
    const { data, error } = await supabase.from("plan_item").update(updateData)
        .eq("id", id)
        .select()
        .single();
    if (error) throw error;
    return data;
}

export const deleteItem = async (id) => {
    const { data, error } = await supabase
        .from("plan_item")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;
};