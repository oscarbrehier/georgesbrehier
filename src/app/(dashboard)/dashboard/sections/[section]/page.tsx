import { getCollectionBySection } from "@/utils/supabase/collections";
import { CollectionsUI } from "./CollectionsUI";
import { supabase } from "@/lib/supabase";
import { cache } from "react";
import { getSectionTree, getSection } from "@/utils/supabase/sections";
import { notFound } from "next/navigation";

const getGalleryItems = cache(
	async (sectionId: string): Promise<GalleryItemWithCollection[] | null> => {

		let query = supabase
			.from("works")
			.select(`
			id,
			image_url,
			position,
			collection:collections!inner (
				id,
				slug,
				title,
				is_visible,
				section:sections!inner (
					id,
					slug
				)
			)	
		`)

		query.eq("collection.section.id", sectionId);

		const { error, data } = await query.returns<GalleryItemWithCollection[]>();
		if (error || !data || data.length === 0) return null;

		return data;

	});

export default async function Page({
	params
}: {
	params: Promise<{ section: string }>
}) {

	const { section: slug } = await params;

	const sectionTree = await getSectionTree(slug, "slug");
	if (!sectionTree) return notFound();

	return (

		<CollectionsUI
			sectionTree={sectionTree}
		/>

	);

};