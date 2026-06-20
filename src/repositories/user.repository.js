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