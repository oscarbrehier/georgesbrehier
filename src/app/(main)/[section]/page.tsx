import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import { notFound, redirect } from "next/navigation";
import { Metadata } from "next";
import { baseSeo, getFullUrl } from "@/utils/seo";
import { capitalize } from "@/utils/capitalize";

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

export async function generateMetadata({
	params
}: {
	params: Promise<{ section: string }>
}): Promise<Metadata> {

	"use cache"

	const { section: sectionSlug } = await params;

	const section = await fetchSupabase<GallerySection>(
		"sections",
		{ slug: sectionSlug },
		"*",
		true
	);

	if (!section) {

		return {
			title: `${capitalize(sectionSlug)}`,
		};

	};

	const url = getFullUrl(`/${sectionSlug}`);
	const title = capitalize(section.title);
	const description = ``;

	return {
		title,
		description,
		keywords: [sectionSlug, section.title, baseSeo.name, "art", "portfolio"],
		openGraph: {
			title: section.title,
			description,
			url,
			siteName: baseSeo.name,
			type: "website",
			locale: "en_US"
		},
		twitter: {
			card: "summary_large_image",
			title: section.title,
			description
		},
		robots: {
			index: true,
			follow: true
		}
	};

};

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