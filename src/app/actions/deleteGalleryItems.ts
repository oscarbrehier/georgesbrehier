"use server"

import { supabase } from "@/lib/supabase";
import { revalidateTag } from "next/cache";

export async function deleteGalleryItems(items: GalleryItemToDelete[]): Promise<{ error: null | string, count: number }> {

	if (!items.length) return { error: null, count: 0 };

	const itemIds = items.map(item => item.id);

	const { data, error } = await supabase
		.from("works")
		.delete()
		.in("id", itemIds)
		.select("id");

	await Promise.all(
		items.map(item => revalidateTag(`gallery-collection-${item.collectionId}`, "max"))
	);

	return { error: error?.message ?? null, count: data?.length ?? 0 };

};