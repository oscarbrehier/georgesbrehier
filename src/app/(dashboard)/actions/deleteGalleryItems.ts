"use server"

import { supabase } from "@/lib/supabase";
import { revalidatePath, revalidateTag } from "next/cache";

export async function deleteGalleryItem(item: GalleryItemToDelete, path: string) {
	return deleteGalleryItems([item], path);
};

export async function deleteGalleryItems(items: GalleryItemToDelete[], path: string): Promise<{ error: null | string, count: number }> {

	if (!items.length) return { error: null, count: 0 };

	const itemIds = items.map(item => item.id);

	const { data, error } = await supabase
		.from("works")
		.delete()
		.in("id", itemIds)
		.select("id");

	await Promise.all(
		items.map(item => revalidateTag(`collection-${item.collectionId}-gallery`, "max"))
	);

	revalidatePath(path);

	return { error: error?.message ?? null, count: data?.length ?? 0 };

};