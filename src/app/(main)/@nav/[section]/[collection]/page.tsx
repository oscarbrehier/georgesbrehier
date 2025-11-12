import { CollectionNav } from "@/app/(main)/@nav/[section]/[collection]/CollectionNav"
import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import { cacheTag } from "next/cache";
import { Suspense } from "react";

type Props = { params: Promise<{ section: string; collection: string }> };

async function loadCollections(sectionSlug: string) {

	"use cache"

	cacheTag(`${sectionSlug}-collections`);

	const collections = await fetchSupabase<GalleryCollectionWithSection[]>(
		"collections",
		{ "section.slug": sectionSlug },
		`
			id,
			title,
			section:sections!inner (
				slug
			)
		`,
	);

	return collections ?? [];

}

export async function NavContent({ params }: Props) {

	const { section: sectionSlug, collection: collectionSlug } = await params;

	const collections = await loadCollections(sectionSlug);
	if (collections.length === 0) return null;

	const sorted = collections.sort((a, b) => Number(b.is_default) - Number(a.is_default));

	return (

		<CollectionNav
			collections={sorted}
			currentCollection={collectionSlug}
			section={sectionSlug}
		/>

	)

}

export default function NavSlot(props: Props) {

	return (
		<Suspense fallback={<div>Loading...</div>}>
			<NavContent {...props} />
		</Suspense>

	);

};