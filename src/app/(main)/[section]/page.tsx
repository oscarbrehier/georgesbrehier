import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import { notFound, redirect } from "next/navigation";

export async function generateStaticParams() {

	const sections = await fetchSupabase(
		"sections",
		{},
		"slug"
	);

	if (!sections) return [];

	return sections.map((section: { slug: string }) => ({
		section: section.slug
	}));

}

export default async function Page({
	params
}: {
	params: Promise<{ section: string }>
}) {

	"use cache"

	let sectionSlug = (await params).section;

	const section = await fetchSupabase(
		"sections",
		{ slug: sectionSlug },
		"*",
		true
	);

	if (!section) {


		const defaultSection = await fetchSupabase<GallerySection>(
			"sections",
			{ is_default: true },
			"*",
			true
		);

		if (!defaultSection) return notFound();

		const defaultCollection = await fetchSupabase<GalleryCollectionWithSection>(
			"collections",
			{ "section.slug": defaultSection.slug, is_default: true },
			`
				id,
				slug,
				section:sections!inner (
				slug
				)
			`,
			true
		);

		if (!defaultCollection) return notFound();

		redirect(`/${defaultSection.slug}/${defaultCollection.slug}`);

	};

	const defaultCollection = await fetchSupabase<GalleryCollectionWithSection>(
		"collections",
		{ "section.slug": sectionSlug, is_default: true },
		`
				id,
				slug,
				section:sections!inner (
					id,
					slug
				)
			`,
		true
	);

	if (!defaultCollection) return notFound();

	redirect(`/${sectionSlug}/${defaultCollection.slug}`);

};