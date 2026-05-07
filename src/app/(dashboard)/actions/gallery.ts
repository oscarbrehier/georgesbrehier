"use server";

import { supabase } from "@/lib/supabase";
import { revalidateTag } from "next/cache";
import { captureException } from "@sentry/nextjs";

export async function updateGalleryItem(
	itemId: string,
	collectionId: string,
	data: {
		title?: string;
		description?: string;
		image_url?: string;
		width?: number;
		height?: number;
	},
) {

	const payload = { ...data };
	if (payload.title) payload.title = payload.title.trim();
	if (payload.description) payload.description = payload.description.trim();

	const { error } = await supabase
		.from("works")
		.update({
			...payload,
		})
		.eq("id", itemId);

	if (error) {
		captureException(new Error(`updateGalleryItem Failed: ${error.message}`), {
			extra: { itemId, collectionId, payload, errorCode: error.code },
		});

		return { error: error.message };
	}

	if (!error) revalidateTag(`collection-${collectionId}-gallery`, "max");

	return { error: null };

};
