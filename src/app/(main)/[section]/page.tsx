import { notFound, redirect } from 'next/navigation'
import { getDefaultSectionWithCollection, getSection } from '@/utils/supabase/sections'
import { getCachedDefaultCollectionBySectionId } from '@/utils/supabase/collections'

export default async function SectionPage({
	params,
}: {
	params: Promise<{ section: string }>
}) {

	const { section: slug } = await params;
	
	const section = await getSection(slug);

	if (!section) {

		const defaultSection = await getDefaultSectionWithCollection();

		if (!defaultSection?.slug || !defaultSection.defaultCollection.slug) return notFound();

		redirect(`${defaultSection.slug}/${defaultSection.defaultCollection.slug}`);

	};

	const collection = await getCachedDefaultCollectionBySectionId(section.id);
	if (!collection) return notFound();

	redirect(`${section.slug}/${collection.slug}`);

};