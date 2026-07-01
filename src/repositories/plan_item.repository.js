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

export const getAllPlanItems = async ({ from, to, showAll, userAreaId, status }) => {
    let query = supabase
        .from('plan_item')
        .select(`
            *,
            marked_by_user:users!marked_by (id, name),
            plan_images (id, created_at, id_item, image_path, image_type),
            plan!inner (
                id,
                title,
                date,
                user:users (id, name, id_role, role (id, role)),
                branch!inner (
                    id,
                    name,
                    id_area,
                    area!inner (id, area)
                )
            )
        `, { count: 'exact' });

    if (!showAll && userAreaId) {
        query = query.eq('plan.branch.id_area', userAreaId);
    }

    if (status) {
        query = query.eq('status', status);
    }

    query = query
        .order('time', { ascending: true })
        .range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return { data, count };
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