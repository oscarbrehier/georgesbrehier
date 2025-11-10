import { fetchSupabase } from '@/utils/supabase/fetchSupabase';
import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';

export const metadata: Metadata = {

};


export default async function Page() {

	const defaultSection = await fetchSupabase<GallerySection>("sections");
	if (!defaultSection) return notFound();

	redirect(`/${defaultSection.title}`);

};
