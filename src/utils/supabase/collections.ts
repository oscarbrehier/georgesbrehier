"use server"

import { supabase } from "@/lib/supabase";
import { cacheTag, unstable_cache } from "next/cache";
import { fetchSupabase } from "./fetchSupabase";

export async function getCollectionsBySection(selector: string, value: string): Promise<GalleryCollection | null> {

	if (!selector || !value) return null;

	const { data, error } = await supabase
		.from("collections")
		.select("*")
		.eq(selector, value);

	if (error || data.length === 0) return null;
	return data[0];

};

export async function getCollectionByTitle(title: string): Promise<GalleryCollection | null> {

	if (!title) return null;

	const { data, error } = await supabase
		.from("collections")
		.select("*")
		.eq("title", title);

	if (error || data.length === 0) return null;
	return data[0];

}

export async function getCollectionsBySectionId(sectionId: string): Promise<GalleryCollection[] | null> {

	'use cache'
	cacheTag("collections");

	if (!sectionId) return null;

	const { data, error } = await supabase
		.from("collections")
		.select("*")
		.eq("section_id", sectionId);

	if (error) return null;
	return data;

};

export async function getDefaultCollection(sectionId: string): Promise<GalleryCollection | null> {

	if (!sectionId) return null;

	const { data, error } = await supabase
		.from("collections")
		.select("*")
		.eq("section_id", sectionId)
		.eq("is_default", true)
		.single();

	if (error) {
		console.error("Error fetching default collection:", error);
		return null;
	};

	return data;

};

export const getCachedDefaultCollection = unstable_cache(
	async (sectionId: string) => getDefaultCollection(sectionId),
	['default-collection'],
	{
		tags: ['collections'],
		revalidate: 3600
	}
);

export async function getCollectionMetadata(collection: string): Promise<GalleryCollectionWithSection | null> {

	"use cache"
	cacheTag(`collection-metadata-${collection}`);

	return await fetchSupabase<GalleryCollectionWithSection>(
		"collections",
		{ "slug": collection },
		`
			id,
			slug,
			title,
			seo_title,
			seo_description,
			seo_og_image_url,
			seo_og_image_width,
			seo_og_image_height,
			seo_og_image_alt,
			seo_twitter_image_url,
			seo_twitter_image_type,
			seo_canonical_url,
			seo_robots,
			section:sections!inner (
				id,
				slug,
				title
			)
		`,
		true
	);

};