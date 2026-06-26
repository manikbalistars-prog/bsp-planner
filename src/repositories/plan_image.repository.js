import { supabase } from "@/lib/supabase";


export const uploadStorageImage = async (filePath, fileBuffer, contentType) => {
    const { data, error } = await supabase.storage
        .from("plan_images")
        .upload(filePath, fileBuffer, {
            contentType: contentType,
            upsert: true,
        });

    if (error) throw error;
    return data;
};

export const getStoragePublicUrl = (filePath) => {
    const { data } = supabase.storage.from("plan_images").getPublicUrl(filePath);
    return data.publicUrl;
};


export const deleteStorageImage = async (filePath) => {
    const { data, error } = await supabase.storage.from("plan_images").remove([filePath]);
    if (error) throw error;
    return data;
};


export const createPlanImage = async (payload) => {
    const { data, error } = await supabase
        .from("plan_images")
        .insert(payload)
        .select()
        .single();

    if (error) throw error;
    return data;
};


export const getPlanImageByType = async (id_item, imageType) => {
    const { data, error } = await supabase
        .from("plan_images")
        .select("*")
        .eq("id_item", id_item)
        .eq("image_type", imageType)
        .maybeSingle();

    if (error) throw error;
    return data;
};


export const deletePlanImageRecord = async (id) => {
    const { data, error } = await supabase
        .from("plan_images")
        .delete()
        .eq("id", id)
        .select()
        .single();

    if (error) throw error;
    return data;
};