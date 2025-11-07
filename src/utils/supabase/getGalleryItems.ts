import { supabase } from "@/lib/supabase";

export async function getGalleryItemIds(section?: string) {

	if (!section) section = "all"

	const query = supabase
		.from("gallery_items")
		.select("id")

	if (section !== "all") {
		query.eq("section", section);
	};

	const { data, error } = await query;

	const ids = data?.map(({ id }) => id);
	return ids;

};

export async function getGalleryItems(ids: number[], section?: string) {

	if (!section) section = "all";

	let query = supabase
		.from("gallery_items")
		.select("*")
		.in("id", ids);

	if (section !== "all") {
		query.eq("section", section);
	};

	// const { count, error } = await supabase
	// 	.from("gallery_items")
	// 	.select("*", { count: "exact", head: true });

	// const itemIds = await getIds();
	// console.log(itemIds);

	const res = await query;

	return res;

};