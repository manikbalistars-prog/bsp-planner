import { supabase } from "@/lib/supabase";

const getTodayIndo = () => {
    const today = new Date(
        new Date().toLocaleString("en-US", { timeZone: "Asia/Jakarta" })
    );
    today.setHours(0, 0, 0, 0);
    return today;
};


export const createPlan = async (obj) => {
    if (obj.date) {
        const inputDate = new Date(obj.date);
        inputDate.setHours(0, 0, 0, 0);

        if (inputDate.getTime() <= getTodayIndo().getTime()) {
            throw new Error("Hanya boleh membuat plan untuk besok atau tanggal setelahnya (H+1).");
        }
    }

    const { data: existing, error: checkError } = await supabase
        .from("plan")
        .select("id")
        .eq("id_user", obj.id_user)
        .eq("date", obj.date)
        .limit(1);

    if (checkError) throw checkError;

    if (existing.length > 0) {
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
            point,
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

    if (error) throw error;
    if (!data) return null;

    const totalTask = data.items.length;

    const totalCompleted = data.items.filter(
        item => item.status === "completed"
    ).length;

    const totalUncompleted = data.items.filter(
        item => item.status === "uncompleted"
    ).length;

    const totalPending = totalTask - totalCompleted - totalUncompleted;

    return {
        ...data,
        totalTask,
        totalCompleted,
        totalUncompleted,
        totalPending,
        totalPoints: data.point || 0,
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
    const { data: existingPlan, error: fetchError } = await supabase
        .from("plan")
        .select("date")
        .eq("id", id)
        .single();

    if (fetchError || !existingPlan) {
        throw new Error("Plan tidak ditemukan.");
    }

    const currentPlanDate = new Date(existingPlan.date);
    currentPlanDate.setHours(0, 0, 0, 0);

    if (currentPlanDate.getTime() <= getTodayIndo().getTime()) {
        throw new Error("Plan hari ini atau yang sudah lewat tidak dapat diubah kembali.");
    }

    if (updateData.date) {
        const newInputDate = new Date(updateData.date);
        newInputDate.setHours(0, 0, 0, 0);

        if (newInputDate.getTime() <= getTodayIndo().getTime()) {
            throw new Error("Hanya boleh mengubah plan ke tanggal besok atau setelahnya (H+1).");
        }
    }

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


export const recalculateAndSavePlanPoints = async (id_plan) => {
    const { data: items, error: fetchError } = await supabase
        .from("plan_item")
        .select("status, after_note")
        .eq("id_plan", id_plan);

    if (fetchError) throw fetchError;

    const totalCompleted = items?.filter(item => item.status === "completed").length || 0;

    const totalPendingWithNote = items?.filter(item =>
        item.status === "pending" &&
        item.after_note &&
        item.after_note.trim() !== ""
    ).length || 0;

    let calculatedPoints = 0;

    if (totalCompleted >= 3) {
        calculatedPoints = 10;
    } else if (totalCompleted > 0 && totalCompleted < 3) {
        calculatedPoints = 5;
    } else if (totalPendingWithNote >= 3) {
        calculatedPoints = 5;
    }

    const { error: updateError } = await supabase
        .from("plan")
        .update({ point: calculatedPoints })
        .eq("id", id_plan);

    if (updateError) throw updateError;

    return calculatedPoints;
}


