import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import { notFound, redirect } from "next/navigation";

export default async function Page({
	params
}: {
	params: Promise<{ section: string }>
}) {

	let sectionSlug = (await params).section;

	const section = await fetchSupabase<GallerySection>(
		"sections",
		{ title: sectionSlug },
		"*",
		true
	);

	const resolvedsSection = section ?? await fetchSupabase<GallerySection>(
		"sections",
		{ is_default: true },
		"*",
		true
	);

	if (!resolvedsSection) return notFound();

	const defaultCollection = await fetchSupabase<GalleryCollection>(
		"collections",
		{ section_id: resolvedsSection.id, is_default: true },
		`
			id,
			title,
			slug,
			section:sections (
				id,
				title,
				slug
			)
		`,
		true
	);

	if (!defaultCollection) return notFound();

	redirect(`/${resolvedsSection.slug}/${defaultCollection.title}`);

};