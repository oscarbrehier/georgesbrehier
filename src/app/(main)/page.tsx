import { notFound, redirect } from 'next/navigation'
import { getDefaultSection } from '@/utils/supabase/sections'

export default async function Home() {

	const defaultSection = await getDefaultSection();

	if (defaultSection?.slug) {
		redirect(`/${defaultSection.slug}`)
	}

	return notFound();

};