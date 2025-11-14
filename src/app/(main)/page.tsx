import { fetchSupabase } from '@/utils/supabase/fetchSupabase';
import { notFound, redirect } from 'next/navigation';
import { Metadata } from 'next';
import { getBaseUrl } from '@/utils/seo';

export async function generateMetadata(): Promise<Metadata> {

	"use cache"

	const defaultSection = await fetchSupabase<GallerySection>(
		"sections",
		{ is_default: true },
		`
			slug,
			title
		`,
		true
	);

	const url = getBaseUrl();
	const title = "Georges Bréhier - Portfolio";
	const description = "Portfolio of Georges Bréhier - Visual artist and photographer showcasing collections of artwork and photography.";

	return {
		title,
		description,
		keywords: ["Georges Bréhier", "art", "photography", "portfolio", "visual artist"],
		openGraph: {
			title,
			description,
			url,
			siteName: "Georges Bréhier",
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
