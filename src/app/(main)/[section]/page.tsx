import { notFound, redirect } from 'next/navigation'
import { getCachedDefaultSection } from '@/utils/supabase/sections'
import { getCachedDefaultCollection } from '@/utils/supabase/collections'

export default async function SectionPage({
	params,
}: {
	params: { section: string }
}) {

	const defaultSection = await getCachedDefaultSection();

	if (defaultSection?.slug === params.section) {

		const defaultCollection = await getCachedDefaultCollection(defaultSection.id);

		if (defaultCollection?.slug) {
			redirect(`/${params.section}/${defaultCollection.slug}`);
		};
		
	};

	return notFound();

};