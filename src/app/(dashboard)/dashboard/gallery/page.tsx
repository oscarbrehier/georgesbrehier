import { supabase } from "@/lib/supabase";
import { redirect, RedirectType } from "next/navigation";
import { cache } from "react";
import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import { GalleryUI } from "./GalleryUI";

const getSections = cache(async () => {

	const { error, data } = await supabase
		.from("sections")
		.select("*");



	const sections = data?.map(({ title }) => title);

	if (sections && sections.length !== 0 && !error) {
		return ["all", ...sections];
	};

	return null;

});

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

	const params = await searchParams;
	let section = Array.isArray(params.section) ? params.section[0] : params.section;


	const collections = await getCollections(section ?? null);

	const sections = await getSections();

	if (!section || !sections?.includes(section)) {
		redirect(`/dashboard/gallery?section=all`, RedirectType.replace);
	};

	const galleryItems = await getGalleryItems(section);

	if (!galleryItems) {
		return null;
	};

	const groupedGalleryItems = galleryItems.reduce<Record<string, GalleryItemWithCollection[]>>((acc, item) => {

		const slug = item.collection.slug;
		(acc[slug] ||= []).push(item);
		return acc;

	}, {});

	return (

		<GalleryUI
			section={section}
			sections={sections}
			collections={collections}
			groupedGalleryItems={groupedGalleryItems}
		/>

	);

};