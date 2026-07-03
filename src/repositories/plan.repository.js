import { supabase } from "@/lib/supabase";


export const createPlan = async (obj) => {
    const { data: existing, error: checkError } = await supabase
        .from("plan")
        .select("id")
        .eq("id_user", obj.id_user)
        .eq("date", obj.date)
        .limit(1);

    if (checkError) throw checkError;

    if (existing) {
        throw new Error("Plan untuk tanggal tersebut sudah dibuat. Mohon untuk memilih tanggal lain! :D");
    }
    const { data, error } = await supabase.from("plan").insert(obj).select().single()
    if (error) throw error

    return data
}

export const getPlanById = async (id) => {
    const { data, error } = await supabase
        .from("plan")
        .select(`
            id,
            title,
            date,
            user:id_user (
                id,
                name,
                role:id_role (
                    id,
                    role
                )
            ),
            branch:id_branch (
                id,
                name,
                area:id_area (
                    id,
                    area
                )
            ),
            items:plan_item(
                *,
                marked_by:users(name),
                images:plan_images(*)))`)

        .eq("id", id).order('time', { foreignTable: 'plan_item', ascending: true })
        .single();

    const totalTask = data.items.length;

    const totalCompleted = data.items.filter(
        item => item.status === "completed"
    ).length;

    const totalUncompleted = data.items.filter(
        item => item.status === "uncompleted"
    ).length;

    const totalPending = totalTask - totalCompleted - totalUncompleted;

    let totalPoints = 0;

    if (totalTask > 0) {
        if (totalCompleted === totalTask) {
            totalPoints = 10;
        } else if (totalUncompleted > 0) {
            totalPoints = 5;
        }
    }

    if (error) throw error;

    return {
        ...data,
        totalTask,
        totalCompleted,
        totalUncompleted,
        totalPending,
        totalPoints,
    };
};

export const getAllPlans = async ({
    page = 1,
    limit = 10,
    search = "",
    showAll = false,
    areaGroup = false,
    id_user,
    area,
    filterUser,
    startDate,
    endDate
}) => {

    const from = (page - 1) * limit;
    const to = from + limit - 1;


    let selectString = `
      id,
      title,
      date,
      user:id_user (
        id,
        name,
        role:id_role (id, role)
      )
    `;

    if (areaGroup && !showAll) {
        selectString += `, branch:id_branch!inner(id, name, area:id_area!inner(id, area))`;
    } else {
        selectString += `, branch:id_branch(id, name, area:id_area(id, area))`;
    }

    let finalQuery = supabase.from("plan").select(selectString, { count: "exact" });


    if (areaGroup && !showAll) {
        if (area) {
            finalQuery = finalQuery.eq("id_branch.id_area.area", area);
        } else {
            finalQuery = finalQuery.eq("id_user", id_user);
        }
    } else if (!showAll) {
        finalQuery = finalQuery.eq("id_user", id_user);
    }

    if (filterUser) {
        finalQuery = finalQuery.eq("id_user", filterUser);
    }

    if (search) {
        finalQuery = finalQuery.ilike("title", `%${search}%`);
    }

    if (startDate) {
        finalQuery = finalQuery.gte("date", startDate);
    }
    if (endDate) {
        finalQuery = finalQuery.lte("date", endDate);
    }


    const { data, error, count } = await finalQuery
        .range(from, to)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    const planIds = data.map(plan => plan.id);

    let summary = {};

    if (planIds.length > 0) {
        const { data: items, error: itemError } = await supabase
            .from("plan_item")
            .select("id_plan, status")
            .in("id_plan", planIds);

        if (itemError) throw new Error(itemError.message);

        items.forEach(item => {
            if (!summary[item.id_plan]) {
                summary[item.id_plan] = {
                    totalItem: 0,
                    completedItem: 0,
                };
            }

            summary[item.id_plan].totalItem++;

            if (item.status === "completed") {
                summary[item.id_plan].completedItem++;
            }
        });
    }

    const result = data.map(plan => ({
        ...plan,
        totalItem: summary[plan.id]?.totalItem ?? 0,
        completedItem: summary[plan.id]?.completedItem ?? 0,
    }));

    return {
        data: result,
        totalData: count,
        totalPages: Math.ceil(count / limit),
    };
};

export const updatePlan = async (id, updateData) => {
    const { data, error } = await supabase
        .from("plan")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;
};

export const deletePlan = async (id) => {
    const { data, error } = await supabase
        .from("plan")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;

    return data;
};