import { getGalleryItems } from "@/utils/supabase/getGalleryItems";
import { notFound, redirect } from "next/navigation";
import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import { ResolvingMetadata } from "next";
import { capitalize } from "@/utils/capitalize";
import { ScrollHint } from "@/components/ScrollHint";
import { cacheTag } from "next/cache";
import VerticalGallery from "@/components/vertical_gallery/Gallery";
import GalleryWrapper from "@/components/gallery/GalleryWrapper";
import Script from "next/script";
import { baseSeo, getFullUrl } from "@/utils/seo";

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

	const url = `/${section}/${collection}`;
	const fullUrl = getFullUrl(url);

	const collectionData = await fetchSupabase<GalleryCollectionWithSection>(
		"collections",
		{ "slug": collection },
		`
			id,
			slug,
			title,
			seo_title,
			seo_description,
			seo_og_image_url,
			seo_og_image_width,
			seo_og_image_height,
			seo_og_image_alt,
			seo_twitter_image_url,
			seo_twitter_image_type,
			seo_canonical_url,
			seo_robots,
			section:sections!inner (
				id,
				slug,
				title
			)
		`,
		true
	);

	if (!collectionData) {

		return {
			title: `${capitalize(section)} - ${capitalize(collection)}`,
		};

	};

	const robotsValue = collectionData.seo_robots || "index, follow";

	const [index, follow] = robotsValue.split(", ").map(v => v.trim());

	const robots = {
		index: index === "index",
		follow: follow === "follow",
		googleBot: {
			index: index === "index",
			follow: follow === "follow",
		}
	};

	const title = capitalize(collectionData.seo_title) || `${capitalize(collectionData.title)} - ${capitalize(collectionData.section?.title)}`;
	const description = collectionData.seo_description || baseSeo.description;

	const ogImages = [];

	if (collectionData.seo_og_image_url) {

		ogImages.push({
			url: collectionData.seo_og_image_url,
			width: collectionData.seo_og_image_width || 1200,
			height: collectionData.seo_og_image_height || 630,
			alt: collectionData.seo_og_image_alt || title,
		});

	};

	const twitterImages = collectionData.seo_twitter_image_url 
		? [collectionData.seo_twitter_image_url]
		: collectionData.seo_og_image_url 
		? [collectionData.seo_og_image_url]
		: [];

	console.log(ogImages)

	return {
		title: `${title}`,
		description,
		keywords: [section, collection, collectionData.title, baseSeo.name, "art", "portfolio"],
		openGraph: {
			title,
			description,
			url: fullUrl,
			siteName: baseSeo.name,
			type: "website",
			locale: "en_US",
			images: ogImages.length > 0 ? ogImages : undefined
		},
		twitter: {
			card: (collectionData.seo_twitter_image_type as "summary" | "summary_large_image") || "summary_large_image",
			title,
			description,
			images: twitterImages.length > 0 ? twitterImages : undefined
		},
		robots,
		alternates: {
			canonical: collectionData.seo_canonical_url || fullUrl
		}
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
				slug,
				title
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

	const fullUrl = getFullUrl(`/${section.slug}/${collection.slug}`);
	
	const structeredData = {
		"@context": "https://schema.org",
		"@type": "ImageGallery",
		"name": `${collection.title} - ${section.title}`,
		"description": `Gallery collection: ${collection.title} by Georges Bréhier`,
		"url": fullUrl,
		"author": {
			"@type": "Person",
			"name": "Georges Bréhier"
		},
		"datePublished": galleryItems.length > 0 ? galleryItems[0].created_at : undefined,
		"dateModified": galleryItems.length > 0 ? galleryItems[galleryItems.length - 1].created_at : undefined,
		"image": galleryItems.map((image: GalleryItem) => ({
			"@type": "ImageObject",
			"contentUrl": image.image_url,
			"name": image.title,
			"description": image.description || image.title,
			"datePublished": image.created_at,
			"author": { 
				"@type": "Person", 
				"name": "Georges Bréhier" 
			}
		}))
	};

	return (

		<>

			<Script
				id="gallery-jsonld"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structeredData) }}
			/>

			<main>

				<ScrollHint />

				<GalleryWrapper items={galleryItems} />
				<VerticalGallery images={galleryItems} />

			</main>

		</>

	);

};