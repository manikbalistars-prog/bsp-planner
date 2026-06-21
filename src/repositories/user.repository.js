import { supabase } from "@/lib/supabase";

export const createUser = async (user) => {
  const { data, error } = await supabase
    .from("users")
    .insert(user)
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const findUserByUsername = async (username) => {
  const { data, error } = await supabase
    .from("users")
    .select(`
      *,
      role:id_role (
        role
      )
    `)
    .eq("username", username)
    .single();
  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data;
}

export const findUserById = async (id) => {
  const { data, error } = await supabase
    .from("users")
    .select(`
      id,
      username,
      name,
      isAdmin,
      id_branch,
      id_role,
      role:id_role ( role ),
      branch:id_branch ( name )
    `)
    .eq("id", Number(id))
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }

  return data;
};

export async function getUsersPaginated({ page = 1, limit = 10, search = "" }) {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("users")
    .select(`
      id, 
      username, 
      name, 
      isAdmin,
      id_branch,
      id_role,
      role:id_role ( role ),
      branch:id_branch ( name )`, { count: "exact" }).eq("isDelete", false);;


  if (search) {
    query = query.ilike("name", `%${search}%`);
  }


  const { data, error, count } = await query.range(from, to).order("created_at", { ascending: false });

  if (error) throw new Error(error.message);

  return {
    users: data,
    totalData: count,
    totalPages: Math.ceil(count / limit),
  };
}