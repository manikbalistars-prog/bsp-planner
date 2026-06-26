import { supabase } from "@/lib/supabase";


export const createPlanItem = async (payload) => {
    const { data, error } = await supabase.from('plan_item').insert(payload).select().single()
    if (error) throw error
    return data
}


export const getItemByPlanId = async (id) => {
    const { data, error } = await supabase.from('plan_item').select(
        `*`
    ).eq('id_plan', id)

    if (error) throw error
    return data
}