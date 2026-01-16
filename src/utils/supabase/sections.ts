"use server"

import { supabase } from "@/lib/supabase";
import { cacheLife, cacheTag } from 'next/cache';
import { fetchSupabase } from "./fetchSupabase";

export async function getSections(): Promise<GallerySection[]> {

	"use cache"
	cacheTag("sections");
	cacheLife("hours");

	const { data, error } = await supabase
		.from("sections")
		.select("*");

	if (error) return [];
	return data;

};

export async function getSection(slug: string): Promise<GallerySection | null> {

	"use cache"
	cacheTag(`section-slug-${slug}`);
	cacheLife("hours");

	let sections = await fetchSupabase<GallerySection>(
		"sections",
		{ slug },
		"*",
		true
	);

	return sections;

};

// export async function getSectionWithDefaultCollection(slug: string): Promise<SectionWithDefaultCollection | null> {

// 	"use cache"
// 	cacheTag(`section-${slug}-default-${collection}`);
// 	cacheLife("hours");

// 	const { data, error } = await supabase
// 		.from("sections")
// 		.select(`
// 				id,
// 				slug,
// 				title,
// 				defaultCollection:collections!inner(is_default, id, slug, title)
// 			`)
// 		.eq("slug", slug)
// 		.filter("collections.is_default", "eq", true)
// 		.single();

// 	if (error) {
// 		console.error("Error fetching default section:", error);
// 		return null;
// 	};

// 	const flattened = {
// 		...data,
// 		defaultCollection: data.defaultCollection[0] ?? undefined
// 	};

// 	return flattened;

// };

export async function getDefaultSectionWithCollection(): Promise<SectionWithDefaultCollection | null> {

	"use cache"
	cacheTag(`default-section-with-collection`);
	cacheLife("hours");

	const { data, error } = await supabase
		.from("sections")
		.select(`
				*,
  				collections!inner(*)
			`)
		.eq("is_default", true)
		.filter("collections.is_default", "eq", true)
		.single();

	if (error) {
		console.error("Error fetching default section:", error);
		return null;
	};

	const flattened = {
		...data,
		defaultCollection: data.collections[0] ?? undefined
	};

	delete flattened.collections;

	return flattened;

};

export async function getSectionTree(value: string, type: "id" | "slug"): Promise<GallerySectionTree | null> {

	const { data, error } = await supabase
		.from("sections")
		.select(`
			id,
			slug,
			collections (
        		id,
				title,
				slug,
				is_default,
				is_visible,
        		works (
          			*
        		)
      		)
		`)
		.eq(type, value)
		.single();

	if (error) {

		console.error("Error fetching full section tree:", error);
		return null;

	};

	return data;

};