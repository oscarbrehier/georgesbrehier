"use server"

import { supabase } from "@/lib/supabase";
import { UI_LABELS } from "@/utils/constants";
import { revalidatePath } from "next/cache";

export async function updateSEO(collection: string, data: GalleryCollectionSEO): Promise<{ success?: boolean, error?: string }> {

	if (!collection || !data) {
		return { error: `Missing ${UI_LABELS.collection.singular} or data` };
	};

	const { error } = await supabase
		.from("collections")
		.update(data)
		.eq("slug", collection);

	if (error) {
		return { error: error.message };
	};
	
	revalidatePath(`/dashboard/${collection}`);
	return { success: true };

};