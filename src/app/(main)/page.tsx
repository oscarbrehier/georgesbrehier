import { notFound, redirect } from 'next/navigation'
import { getDefaultSectionWithCollection } from '@/utils/supabase/sections'

export default async function Home() {

	const defaultSection = await getDefaultSectionWithCollection();

	if (!defaultSection?.slug || !defaultSection.defaultCollection.slug) {
		return notFound();
	};

	redirect(`/${defaultSection.slug}/${defaultSection.defaultCollection.slug}`);

};