import { fetchSupabase } from '@/utils/supabase/fetchSupabase';
import { notFound, redirect } from 'next/navigation';

export default async function Page() {

	"use cache"

	const defaultSection = await fetchSupabase<GallerySection>(
		"sections",
		{ is_default: true },
		`
			title,
			slug
		`,
		true
	);

	if (!defaultSection) return notFound();

	redirect(`/${defaultSection.title}`);

};
