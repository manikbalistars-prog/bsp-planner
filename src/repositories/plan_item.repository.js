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

export const getAllPlanItems = async ({ from, to, showAll, userAreaId, status, idUser, search }) => {
    let query = supabase
        .from('plan')
        .select(`
           id,
            title,
            date,
            user:users (id, name, id_role, role (id, role)),
            branch!inner (
                id,
                name,
                id_area,
                area!inner (id, area)
            ),
            plan_item!inner (
                *,
                marked_by_user:users!marked_by (id, name),
                plan_images (id, created_at, id_item, image_path, image_type)
            )
        `, { count: 'exact' });

    if (!showAll && userAreaId) {
        query = query.eq('branch.id_area', userAreaId);
    }

    if (search) {
        query = query.ilike('plan_item.description', `%${search}%`);
    }

    if (status) {
        query = query.eq('plan_item.status', status);
    }
    if (idUser) {
        query = query.eq('id_user', idUser);
    }

    query = query
        .order('date', { ascending: false })
        .range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    const formattedData = [];

    if (data) {
        data.forEach(plan => {
            const items = plan.plan_item || [];
            const sortedItems = [...items].sort((a, b) => a.time.localeCompare(b.time));

            sortedItems.forEach(item => {
                formattedData.push({
                    id: item.id,
                    created_at: item.created_at,
                    id_plan: item.id_plan,
                    description: item.description,
                    time: item.time,
                    status: item.status,
                    marked_by: item.marked_by,
                    note: item.note,
                    marked_at: item.marked_at,
                    before_note: item.before_note,
                    after_note: item.after_note,
                    marked_by_user: item.marked_by_user,
                    plan_images: item.plan_images,
                    plan: {
                        id: plan.id,
                        date: plan.date,
                        title: plan.title,
                        user: plan.user,
                        branch: plan.branch
                    }
                });
            });
        });
    }

    return { data: formattedData, count };
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


export const getPlanItemForValidation = async (id) => {
    const { data, error } = await supabase
        .from("plan_item")
        .select("id_plan, status, after_note")
        .eq("id", id)
        .single();

    if (error) throw error;
    return data;
};