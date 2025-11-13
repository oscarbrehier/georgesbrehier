"use server"

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function updateSEO(collection: string, data: GalleryCollectionSEO): Promise<{ success?: boolean, error?: string }> {

	if (!collection || !data) {
		return { error: "Missing collection or data" };
	};

	const { error } = await supabase
		.from("collections")
		.update(data)
		.eq("slug", collection);

	if (error) {
		return { error: error.message };
	};
	
	revalidatePath(`/dashboard/gallery/${collection}`);
	return { success: true };

};