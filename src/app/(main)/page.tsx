import { notFound, redirect } from 'next/navigation'
import { getCachedDefaultSection } from '@/utils/supabase/sections'

export default async function Home() {

	const defaultSection = await getCachedDefaultSection();

	if (defaultSection?.slug) {
		redirect(`/${defaultSection.slug}`)
	}

	return notFound();

};