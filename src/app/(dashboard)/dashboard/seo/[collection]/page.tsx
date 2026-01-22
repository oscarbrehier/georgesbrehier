import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import { SeoEditor } from "./SeoEditor";

async function getCollectionSEO(collection: string) {

	const data = await fetchSupabase<GalleryCollectionSEO>(
		"collections",
		{ title: collection },
		`
			id,
			seo_title,
			seo_description,
			seo_og_image_url,
			seo_og_image_width,
			seo_og_image_height,
			seo_og_image_alt,
			seo_twitter_image_url,
			seo_twitter_image_type,
			seo_canonical_url,
			seo_robots
		`,
		true
	);

	return data;

};

export default async function Page({
	params
}: {
	params: Promise<{ collection: string }>
}) {

	const { collection } = await params;

	const seo = await getCollectionSEO(collection);
	const imageGallery = await fetchSupabase<GalleryItem[]>(
		"works",
		{ "collection.slug": collection },
		`
			id,
			title,
			image_url,
			collection:collections!inner (
				slug
			)
		`
	);

	if (!imageGallery) return ;

	return (

		<>
			{seo && (<SeoEditor collection={collection} data={seo} imageGallery={imageGallery} />)}
		</>

	);

};