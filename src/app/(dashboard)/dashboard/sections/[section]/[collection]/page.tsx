import { CollectionsUI } from "./CollectionsUI";
import { getSectionTree } from "@/utils/supabase/sections";
import { notFound } from "next/navigation";

export default async function Page({
	params
}: {
	params: Promise<{ section: string; collection: string; }>
}) {

	const { section: sectionSlug, collection: collectionSlug } = await params;

	const sectionTree = await getSectionTree(sectionSlug, "slug");
	if (!sectionTree) return notFound();

	return (

		<CollectionsUI
			sectionTree={sectionTree}
			active={collectionSlug}
		/>

	);

};