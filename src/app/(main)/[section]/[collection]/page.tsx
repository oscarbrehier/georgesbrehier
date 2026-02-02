import { getGalleryItems } from "@/utils/supabase/gallery";
import { notFound, redirect } from "next/navigation";
import { fetchSupabase } from "@/utils/supabase/fetchSupabase";
import { ResolvingMetadata } from "next";
import { capitalize } from "@/utils/capitalize";
import { ScrollHint } from "@/components/ScrollHint";
import VerticalGallery from "@/components/gallery/GalleryStack";
import GalleryWrapper from "@/components/gallery/GallerySpread";
import Script from "next/script";
import { baseSeo, getFullUrl } from "@/utils/seo";
import { getCollectionMetadata, getCachedDefaultCollectionBySectionId, getCollectionId, getActiveCollections } from "@/utils/supabase/collections";
import { getDefaultSectionWithCollection, getSection, getSectionId } from "@/utils/supabase/sections";
import { UI_LABELS } from "@/utils/constants";
import { GallerySwitcher } from "@/components/gallery/GallerySwitcher";

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

	const { section, collection } = await params;

	const defaultMetadata = {
		title: `${capitalize(section)} - ${capitalize(collection)}`,
	};

	const url = `/${section}/${collection}`;
	const fullUrl = getFullUrl(url);

	const collectionId = await getCollectionId(collection);
	if (!collectionId) return defaultMetadata;

	const metadata = await getCollectionMetadata(collectionId);
	if (!metadata) return defaultMetadata;

	const robotsValue = metadata.seo_robots || "index, follow";

	const [index, follow] = robotsValue.split(", ").map(v => v.trim());

	const robots = {
		index: index === "index",
		follow: follow === "follow",
		googleBot: {
			index: index === "index",
			follow: follow === "follow",
		}
	};

	const title = capitalize(metadata.seo_title) || `${capitalize(metadata.title)} - ${capitalize(metadata.section?.title)}`;
	const description = metadata.seo_description || baseSeo.description;

	const ogImages = [];

	if (metadata.seo_og_image_url) {

		ogImages.push({
			url: metadata.seo_og_image_url,
			width: metadata.seo_og_image_width || 1200,
			height: metadata.seo_og_image_height || 630,
			alt: metadata.seo_og_image_alt || title,
		});

	};

	const twitterImages = metadata.seo_twitter_image_url
		? [metadata.seo_twitter_image_url]
		: metadata.seo_og_image_url
			? [metadata.seo_og_image_url]
			: [];

	return {
		title: `${title}`,
		description,
		keywords: [section, collection, metadata.title, baseSeo.name, "art", "portfolio"],
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
			card: (metadata.seo_twitter_image_type as "summary" | "summary_large_image") || "summary_large_image",
			title,
			description,
			images: twitterImages.length > 0 ? twitterImages : undefined
		},
		robots,
		alternates: {
			canonical: metadata.seo_canonical_url || fullUrl
		}
	};

};

export default async function Page({
	params
}: Props) {

	const { section: sectionSlug, collection: collectionSlug } = await params;

	const sectionId = await getSectionId(sectionSlug);
	if (!sectionId) return notFound();

	let section = await getSection(sectionId);
	const defaultSectionPromise = getDefaultSectionWithCollection();

	if (!section) {

		section = await defaultSectionPromise;
		if (!section) return notFound();

	};

	const collectionId = await getCollectionId(collectionSlug);
	if (!collectionId) return notFound();

	const collectionPromise = getCollectionMetadata(collectionId);
	const defaultCollectionPromise = getCachedDefaultCollectionBySectionId(section.id);

	let collection = await collectionPromise;

	if (!collection) {

		collection = await defaultCollectionPromise;
		if (!collection) return notFound();

		redirect(`/${section.slug}/${collection.slug}`);

	}

	if (!section.is_visible || !collection.is_visible) {
		return notFound();
	};

	if (collection.section.slug !== sectionSlug) {
		redirect(`/${collection.section.slug}/${collection.slug}`);
	};

	const { data: galleryItems, error } = await getGalleryItems({ collectionId: collection.id });

	if (error || !galleryItems || galleryItems.length == 0) {
		return notFound();
	};

	const fullUrl = getFullUrl(`/${section.slug}/${collection.slug}`);

	const structeredData = {
		"@context": "https://schema.org",
		"@type": "ImageGallery",
		"name": `${collection.title} - ${section.title}`,
		"description": `Gallery ${UI_LABELS.collection.singular}: ${collection.title} by Georges Bréhier`,
		"url": fullUrl,
		"author": {
			"@type": "Person",
			"name": "Georges Bréhier"
		},
		"datePublished": galleryItems.length > 0 ? galleryItems[0].created_at : undefined,
		"dateModified": galleryItems.length > 0 ? galleryItems[galleryItems.length - 1].created_at : undefined,
		"image": galleryItems.slice(0, 20).map((image: GalleryItem) => ({
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

	const collections = await getActiveCollections(sectionId);

	return (

		<>

			<Script
				id="gallery-jsonld"
				type="application/ld+json"
				dangerouslySetInnerHTML={{ __html: JSON.stringify(structeredData) }}
				strategy="afterInteractive"
			/>

			<ScrollHint />

			<GallerySwitcher
				currentCollection={collectionId}
				collections={collections}
				items={galleryItems}
			/>

		</>

	);

};