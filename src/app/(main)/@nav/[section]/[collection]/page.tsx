import { CollectionNav } from "@/app/(main)/@nav/[section]/[collection]/CollectionNav"
import { getActiveCollections } from "@/utils/supabase/collections";
import { getSectionId } from "@/utils/supabase/sections";
import { Suspense } from "react";

type Props = { params: Promise<{ section: string; collection: string }> };

export async function NavContent({ params }: Props) {

	const { section: sectionSlug, collection: collectionSlug } = await params;

	const sectionId = await getSectionId(sectionSlug);
	if (!sectionId) return null;

	const collections = await getActiveCollections(sectionId);
	if (!collections) return ;

	return (

		<CollectionNav
			collections={collections}
			currentCollection={collectionSlug}
		/>

	)

}

export default function NavSlot(props: Props) {

	return (
		<Suspense>
			<NavContent {...props} />
		</Suspense>

	);

};