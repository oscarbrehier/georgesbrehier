"use server"

import { supabase } from "@/lib/supabase";
import { revalidateTag } from "next/cache";

export async function updateGalleryItems(items: { id: number, collectionId: string, data: Partial<GalleryItem> }[]) {

	const updatedCollections = new Set<string>();

	await Promise.all(
		items.map(async (item) => {
			const { error } = await supabase
				.from("works")
				.update(item.data)
				.eq("id", item.id);

			if (error) console.error("Failed to update item:", item.id, error);

			updatedCollections.add(item.collectionId);
		})
	);

	updatedCollections.forEach((slug) => revalidateTag(`gallery-collection-${slug}`, "max"));

};