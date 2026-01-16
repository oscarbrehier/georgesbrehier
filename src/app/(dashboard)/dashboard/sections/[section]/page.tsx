import { getCollectionBySection } from "@/utils/supabase/collections";
import { CollectionsUI } from "./CollectionsUI";
import { supabase } from "@/lib/supabase";
import { cache } from "react";
import Link from "next/link";

const getGalleryItems = cache(
	async (section: string): Promise<GalleryItemWithCollection[] | null> => {

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

		if (section !== "all") {
			query.eq("collection.section.slug", section);
		};

		const { error, data } = await query.returns<GalleryItemWithCollection[]>();
		if (error || !data || data.length === 0) return null;

		return data;

	});

export default async function Page({
	params
}: {
	params: Promise<{ section: string }>
}) {

	const { section } = await params;
	const collections = await getCollectionBySection(section);
	const galleryItems = await getGalleryItems(section);

	const groupedGalleryItems = galleryItems?.reduce<Record<string, GalleryItemWithCollection[]>>((acc, item) => {

		const slug = item.collection.slug;
		(acc[slug] ||= []).push(item);
		return acc;

	}, {}) ?? null;

	return (

		<CollectionsUI
			section={section}
			collections={collections}
			groupedGalleryItems={groupedGalleryItems}
		/>

	);

};