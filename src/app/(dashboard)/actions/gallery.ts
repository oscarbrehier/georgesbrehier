"use server"

import { supabase } from "@/lib/supabase"
import { revalidateTag } from "next/cache";

export async function updateGalleryItem(itemId: string, collectionId: string, data: {
	title?: string,
	description?: string,
	image_url?: string,
	width?: number,
	height?: number
}) {

	const payload = { ...data };
	if (payload.title) payload.title = payload.title.trim();
	if (payload.description) payload.description = payload.description.trim();

	delete payload.height;
	delete payload.width;

	const { error } = await supabase
		.from("works")
		.update({
			...payload
		})
		.eq("id", itemId);

	if (!error) revalidateTag(`collection-${collectionId}-gallery`, "max");

	return { error: error?.message ?? null };

};