import { fetchSupabase } from '@/utils/supabase/fetchSupabase';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { baseSeo, getBaseUrl } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {

	"use cache"

	const url = getBaseUrl();
	const title = "Portfolio";
	const description = baseSeo.description;

	return {
		title,
		description,
		keywords: [baseSeo.name, "art", "portfolio"],
		openGraph: {
			title,
			description,
			url,
			siteName: baseSeo.name,
			type: "website",
			locale: "en_US"
		},
		twitter: {
			card: "summary_large_image",
			title,
			description
		},
		robots: {
			index: true,
			follow: true
		}
	};

}

export default async function Page() {

	"use cache"

	const defaultSection = await fetchSupabase<GallerySection>(
		"sections",
		{ is_default: true },
		`
			slug
		`,
		true
	);

	if (!defaultSection) return notFound();

	redirect(`/${defaultSection.slug}`);

};
