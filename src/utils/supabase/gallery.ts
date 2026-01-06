"use server"

import { supabase } from "@/lib/supabase";
import { PostgrestError } from "@supabase/supabase-js";
import { cacheLife, cacheTag } from "next/cache";

export async function getGalleryItems(opts?: { section?: string, range?: number[], collectionId?: string }): Promise<{
	data: GalleryItem[],
	error: PostgrestError | null
}> {

	"use cache"

	let { section = "all", range, collectionId } = opts || {};

	if (collectionId) cacheTag(`gallery-collection-${collectionId}`);
	cacheLife("hours");

	if (!section) section = "all";

	let query = supabase
		.from("works")
		.select("*")
		.order("created_at", { ascending: false })
		.eq("collection_id", collectionId);

	if (section !== "all") {
		query = query.eq("section", section);
	};

	if (range && range.length >= 2) {
		query = query.range(range[0], range[1]);
	};

	const { data, error } = await query;

	return {
		error,
		data: (data as GalleryItem[]).sort((a, b) => a.position - b.position)
	};

};