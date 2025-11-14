import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import { MetadataRoute } from "next";
import { getBaseUrl } from "@/utils/seo";

const BASE_URL = getBaseUrl();

const DEFAULT_SITEMAP: MetadataRoute.Sitemap = BASE_URL ? [
	{
		url: BASE_URL,
		lastModified: new Date(),
		changeFrequency: "monthly",
		priority: 1
	}
] : [];


async function getCollections() {

	const collections = await fetchSupabase<GalleryCollectionWithSection[]>(
		"collections",
		{},
		`
			id,
			slug,
			is_default,
			section:sections!inner (
				id,
				slug
			)
		`
	);

	return collections ?? [];

};


export default async function sitemap(): Promise<MetadataRoute.Sitemap> {

	const collections = await getCollections();
	
	if (collections.length === 0) return DEFAULT_SITEMAP;

	const collectionRoutes: MetadataRoute.Sitemap = collections.map((collection) => ({
		url: BASE_URL 
			? `${BASE_URL}/${collection.section.slug}/${collection.slug}`
			: `/${collection.section.slug}/${collection.slug}`,
		lastModified: new Date(),
		changeFrequency: "monthly" as const,
		priority: collection.is_default ? 1 : 0.8
	}));

	return [...DEFAULT_SITEMAP, ...collectionRoutes];

};