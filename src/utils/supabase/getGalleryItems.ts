"use server"

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

export async function getGalleryItems(opts?: { section?: string, range?: number[] }) {

	let { section, range } = opts || { section: null, range: [] };

	if (!section) section = "all";

	let query = supabase
		.from("gallery_items")
		.select("*")
		.order("created_at", { ascending: false });

	if (section !== "all") {
		query.eq("section", section);
	};

	if (range && range.length >= 2) {
		query.range(range[0], range[1]);
	};
	
	const res = await query;

	return res;

};