import { CollectionNav } from "@/app/(main)/[section]/[collection]/CollectionNav"
import { fetchSupabase } from "@/utils/supabase/fetchSupabase";

export default async function NavSlot({
	params
}: {
	params: Promise<{ section: string, collection: string }>
}) {

	const { section: sectionSlug, collection: collectionSlug } = await params;

	const collections = await fetchSupabase<GalleryCollectionWithSection[]>(
		"collections",
		{ "section.slug": sectionSlug },
		`
			id,
			title,
			slug,
			is_default,
			section:sections!inner (
				id,
				slug
			)
		`,
	);

	if (!collections || collections.length === 0) return;

	return (

		<CollectionNav
			collections={collections.sort((a, b) => Number(b.is_default) - Number(a.is_default))}
			currentCollection={collectionSlug}
			section={sectionSlug}
		/>

	)

}