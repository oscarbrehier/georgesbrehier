import { getGalleryItems } from "@/utils/supabase/getGalleryItems";
import { notFound, redirect } from "next/navigation";
import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import { ResolvingMetadata } from "next";
import { capitalize } from "@/utils/capitalize";
import { ScrollHint } from "@/components/ScrollHint";
import { cacheTag } from "next/cache";
import VerticalGallery from "@/components/vertical_gallery/Gallery";
import GalleryWrapper from "@/components/gallery/GalleryWrapper";

type Props = {
	params: Promise<{ section: string, collection: string }>
};

export async function generateStaticParams() {

	const collections = await fetchSupabase<GalleryCollectionWithSection[]>(
		"collections",
		{},
		`
			id,
			slug,
			section:sections!inner (
				slug
			)
		`,
	);

	if (!collections) return [];

	return collections
		.filter(c => c.section?.slug && c.slug)
		.map(c => ({
			section: c.section!.slug,
			collection: c.slug
		}));

};

export async function generateMetadata(
	{ params }: Props,
	parent: ResolvingMetadata
) {

	"use cache"

	const { section, collection } = await params;

	const baseTitle = `${capitalize(section)} - ${capitalize(collection)}`;
	const url = `/${section}/${collection}`;

	const collectionData = await fetchSupabase(
		"collections",
		{ "slug": collection },
		`
			slug,
			seo_og_image_url
		`,
		true
	);

	return {
		title: `${baseTitle} | Georges Bréhier`,
		description: "",
		openGraph: {
			title: baseTitle,
			description: "",
			url,
			siteName: "Georges Bréhier",
			type: "website",
			locale: "en_US",
			images: collectionData.seo_og_image_url ? [collectionData.seo_og_image_url] : []
		},
		twitter: {
			card: "summary_large_image",
			title: baseTitle,
			description: "",

		},
		robots: {
			index: true,
			follow: true
		},
		keywords: [section, collection, "Georges Bréhier"]
	};

};

async function getDefaultCollection(sectionId: string): Promise<GalleryCollectionWithSection | null> {

	"use cache"

	cacheTag(`default-collection-${sectionId}`);

	const collection = await fetchSupabase<GalleryCollectionWithSection>(
		"collections",
		{ section_id: sectionId, is_default: true },
		`
				id,
				slug,
				title,
				is_default,
				section:sections!inner (
					id,
					slug
				)
				`,
		true
	);

	return collection;

};

async function getSection(slug: string): Promise<GallerySection | null> {

	let sections = await fetchSupabase<GallerySection>(
		"sections",
		{ slug },
		"*",
		true
	);

	return sections;

};

export default async function Page({
	params
}: Props) {

	"use cache"

	const { section: sectionSlug, collection: collectionSlug } = await params;

	let section = await getSection(sectionSlug);

	if (!section) {

		section = await fetchSupabase<GallerySection>(
			"sections",
			{ is_default: true },
			"*",
			true
		);

		if (!section) return notFound();

		const defaultCollection = await getDefaultCollection(section.id);
		if (!defaultCollection) return notFound();

		redirect(`/${section.slug}/${defaultCollection.slug}`);

	};

	let collection = await fetchSupabase<GalleryCollectionWithSection>(
		"collections",
		{ "slug": collectionSlug, section_id: section.id },
		`
			id,
			slug,
			title,
			is_default,
			section:sections!inner (
				id,
				slug
			)
		`,
		true
	);

	if (!collection) {

		collection = await getDefaultCollection(section.id);
		if (!collection) return notFound();

		redirect(`/${section.slug}/${collection?.slug}`);

	};

	const { data: galleryItems, error } = await getGalleryItems({ collectionId: collection.id });
	if (error || !galleryItems || galleryItems.length == 0) return notFound();

	cacheTag(`gallery-items-collection-${collection.id}`);

	return (

		<>

			<main>

				<ScrollHint />

				<GalleryWrapper items={galleryItems} />
				<VerticalGallery images={galleryItems} />

			</main>

		</>

	);

};