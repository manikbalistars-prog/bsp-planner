import { NextResponse } from "next/server";
import { requireApiSession } from "@/lib/api-auth";
import { getPlanImageByType, uploadStorageImage, getStoragePublicUrl, createPlanImage, deleteStorageImage, deletePlanImageRecord } from "@/repositories/plan_image.repository";

export const POST = async (req) => {
    try {
        const { user, error: authError } = requireApiSession(req);
        if (authError) return authError;

        
        const formData = await req.formData();
        
        const file = formData.get("file"); 
        const id_item = formData.get("id_item");
        const image_type = formData.get("image_type"); 
        
        
        const id_user_plan = formData.get("id_user_plan"); 
         if (id_user_plan != user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        if (!file || !id_item || !image_type) {
            return NextResponse.json({ success: false, message: "File, id_item, and image_type are required" }, { status: 400 });
        }

        const existingImage = await getPlanImageByType(id_item, image_type);
        if (existingImage) {
            
            const oldPath = existingImage.image_path.split("/storage/v1/object/public/plan_images/")[1];
            if (oldPath) {
                await deleteStorageImage(oldPath).catch(err => console.log("Old file not found in storage, skipping..."));
            }
            await deletePlanImageRecord(existingImage.id);
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const fileExt = file.name.split(".").pop();
        const fileName = `${id_item}_${image_type}_${Date.now()}.${fileExt}`;
        const filePath = `${id_item}/${fileName}`; 
     

        await uploadStorageImage(filePath, buffer, file.type);


        const publicUrl = getStoragePublicUrl(filePath);

  
        const imageRecord = await createPlanImage({
            id_item,
            image_path: publicUrl, 
            image_type
        });

        return NextResponse.json({
            success: true,
            message: `Photo ${image_type} uploaded successfully`,
            data: imageRecord
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};


export const DELETE = async (req) => {
    try {
        const { user, error: authError } = requireApiSession(req);
        if (authError) return authError;

        const body = await req.json();
        const {id_user_plan, id_item, image_type } = body; 

        if (id_user_plan != user.id) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        if (!id_item || !image_type) {
            return NextResponse.json({ success: false, message: "id_item and image_type are required" }, { status: 400 });
        }

        
        const existingImage = await getPlanImageByType(id_item, image_type);
        if (!existingImage) {
            return NextResponse.json({ success: false, message: "Image record not found" }, { status: 404 });
        }
        const storagePath = existingImage.image_path.split("/storage/v1/object/public/plan_images/")[1];
        if (storagePath) {
            await deleteStorageImage(storagePath).catch(err => console.log("File tidak ditemukan di storage, lanjut hapus record..."));
        }

    
        await deletePlanImageRecord(existingImage.id);


        return NextResponse.json({
            success: true,
            message: `Photo ${image_type} deleted successfully`
        });

    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
};