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


export const findUserByUsername =
  async (username) => {
    const { data, error } =
      await supabase
        .from("users")
        .select("*")
        .eq(
          "username",
          username
        )
        .single();

    if (error) return null;

    return data;
  };