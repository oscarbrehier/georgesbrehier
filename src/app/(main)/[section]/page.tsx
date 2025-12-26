import { notFound, redirect } from 'next/navigation'
import { getDefaultSection } from '@/utils/supabase/sections'
import { getDefaultCollectionBySectionId } from '@/utils/supabase/collections'

export default async function SectionPage({
	params,
}: {
	params: Promise<{ section: string }>
}) {

	const { section } = await params;
	const defaultSection = await getDefaultSection();

	if (defaultSection?.slug === section) {

		const defaultCollection = await getDefaultCollectionBySectionId(defaultSection.id);

		if (defaultCollection?.slug) {
			redirect(`/${section}/${defaultCollection.slug}`);
		};
		
	};

	return notFound();

};