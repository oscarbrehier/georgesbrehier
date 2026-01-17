"use server"

import { supabase } from "@/lib/supabase";
import { revalidateTag } from "next/cache";

export async function uploadToGallery(title: string, description: string, image_url: string, collectionId: string): Promise<{
	result: any[] | null;
	error: string | null;
}> {

	try {

		const { data, error } = await supabase
			.from("works")
			.insert([{ title, description, image_url, collection_id: collectionId }])
			.select();

		if (error) return { result: null, error: error.message }

		revalidateTag(`collection-${collectionId}-gallery`, "max")

		return { result: data, error: null };

	} catch (err) {

		console.error("Gallery upload failed:", err);

		const message = err instanceof Error ? err.message : "Upload failed";
		return { result: null, error: message };

	};

};