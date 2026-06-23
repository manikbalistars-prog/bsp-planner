import { supabase } from "@/lib/supabase";


export const createPlan = async (obj) => {
    const { data, error } = await supabase.from("plan").insert(obj).select().single()
    if (error) throw error

    return data
}

export const getAllPlans = async ({
    page = 1,
    limit = 10,
    search = "",
    showAll = false,
    areaGroup = false,
    id_user,
    area 
}) => {

    console.log({ areaGroup, area })

    const from = (page - 1) * limit;
    const to = from + limit - 1;

    
    const branchRelation = areaGroup && !showAll 
        ? 'branch:id_branch!inner(id, name, area:id_area!inner(id, area))' 
        : 'branch:id_branch(id, name, area:id_area(id, area))';

    let query = supabase
        .from("plan")
        .select(
            `
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
      ${branchRelation === 'branch:id_branch(id, name, area:id_area(id, area))' ? 'branch:id_branch(id, name, area:id_area(id, area))' : branchRelation}
    `,
            { count: "exact" }
        );

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


    if (search) {
        finalQuery = finalQuery.ilike("title", `%${search}%`);
    }


    const { data, error, count } = await finalQuery
        .range(from, to)
        .order("created_at", { ascending: false });

    if (error) throw new Error(error.message);

    return {
        data,
        totalData: count,
        totalPages: Math.ceil(count / limit),
    };
};