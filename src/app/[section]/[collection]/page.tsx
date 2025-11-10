import { Gallery } from "@/components/Gallery";
import { VerticalGallery } from "@/components/vertical_gallery/Gallery";
import { roboto } from "@/utils/fonts";
import { getCollectionsBySectionId } from "@/utils/supabase/getCollection";
import { getGalleryItems } from "@/utils/supabase/getGalleryItems";
import { notFound, redirect } from "next/navigation";
import { CollectionNav } from "./CollectionNav";
import { fetchSupabase } from "@/utils/supabase/fetchSupabase";

async function getDefaultCollection(sectionId: string): Promise<GalleryCollectionWithSection | null> {

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

export default async function Page({
	params
}: {
	params: Promise<{ section: string, collection: string }>
}) {

	const { section: sectionSlug, collection: collectionSlug } = await params;

	let section = await fetchSupabase<GallerySection>(
		"sections",
		{ slug: sectionSlug },
		"*",
		true
	);

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
		console.log(collection)
		if (!collection) return notFound();

		redirect(`/${section.slug}/${collection?.slug}`);

	};

	const { data: galleryItems, error } = await getGalleryItems({ collectionId: collection.id });
	if (error || !galleryItems || galleryItems.length == 0) return notFound(); // should show an error page

	return (

		<>

			<main>

				{galleryItems && (
					<>
						<Gallery items={galleryItems} />
						<VerticalGallery images={galleryItems} />
					</>
				)}

			</main>

		</>

	);

};