"use server"
import { supabase } from "@/lib/supabase";
import { cacheLife, cacheTag } from "next/cache";
import { fetchSupabase } from "./fetchSupabase";

export async function getCollectionsBySectionId(sectionId: string): Promise<GalleryCollection[] | null> {

    "use cache"
	cacheTag(`collections-section-${sectionId}`);
	cacheLife("hours");

	if (!sectionId) return null;

	const { data, error } = await supabase
		.from("collections")
		.select("*")
		.eq("section_id", sectionId);

	if (error) return null;
	return data;

};

export async function getCollectionMetadata(collection: string): Promise<GalleryCollectionWithSection | null> {

	"use cache"
	cacheTag(`collection-metadata-${collection}`);
	cacheLife("hours");

	return await fetchSupabase<GalleryCollectionWithSection>(
		"collections",
		{ "slug": collection },
		`
            id,
            slug,
            title,
            is_default,
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

export async function getDefaultCollectionBySectionId(sectionId: string): Promise<GalleryCollectionWithSection | null> {

    "use cache"
	cacheTag(`section-${sectionId}-default-collection`);
	cacheLife("hours");

	return await fetchSupabase<GalleryCollectionWithSection>(
		"collections",
		{ section_id: sectionId, is_default: true },
		`
            id,
            slug,
            title,
            is_default,
            section:sections!inner (
                id,
                slug
            )
        `,
		true
	);

};