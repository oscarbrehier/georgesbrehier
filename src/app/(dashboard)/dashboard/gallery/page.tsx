import { supabase } from "@/lib/supabase";
import { redirect, RedirectType } from "next/navigation";
import { cache } from "react";
import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import { GalleryUI } from "./GalleryUI";
import { getSections } from "@/utils/supabase/sections";

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
				visible,
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

const getCollections = cache(async (section: string | null) => {

	const filter = (section && section !== "all") ? { "sections.slug": section } : {};

	const data = await fetchSupabase<GalleryCollection[]>(
		"collections",
		filter,
		`
			id,
			title,
			slug,
			visible,
			section:sections!inner (
				id,
				slug
			)
		`
	);

	return data ?? [];

});

export default async function Page({
	searchParams
}: {
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {

	const DEFAULT_SECTION = 'all';

	const params = await searchParams;
	let section = Array.isArray(params.section) ? params.section[0] : params.section;

	const collections = await getCollections(section ?? null);

	const sections = [
		{ slug: DEFAULT_SECTION, title: 'all' } as GallerySection,
		...await getSections(),
	]

	const validSlugs = new Set(sections.map(s => s.slug))

	if (!section || !validSlugs.has(section)) {
		redirect(`/dashboard/gallery?section=${DEFAULT_SECTION}`, RedirectType.replace);
	};

	const galleryItems = await getGalleryItems(section);

	const groupedGalleryItems = galleryItems?.reduce<Record<string, GalleryItemWithCollection[]>>((acc, item) => {

		const slug = item.collection.slug;
		(acc[slug] ||= []).push(item);
		return acc;

	}, {}) ?? null;

	return (

		<GalleryUI
			section={section}
			sections={sections}
			collections={collections}
			groupedGalleryItems={groupedGalleryItems}
		/>

	);

};