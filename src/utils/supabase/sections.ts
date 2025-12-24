import { supabase } from "@/lib/supabase";
import { unstable_cache } from 'next/cache';

export async function getSectionBy(selector: string, value: string): Promise<GallerySection | null> {

	if (!selector || !value) return null;

	const { data, error } = await supabase
		.from("sections")
		.select("*")
		.eq(selector, value);

	if (error || data.length === 0) return null;
	return data[0];
 
};

export async function getDefaultSection(): Promise<GallerySection | null> {

	const { data, error } = await supabase
		.from("sections")
		.select("*")
		.eq("is_default", true)
		.single();

	if (error) {
		console.error("Error fetching default section:", error);
		return null;
	};

	return data;

};

export const getCachedDefaultSection = unstable_cache(
	async () => getDefaultSection(),
	['default-section'],
	{
		tags: ['sections'],
		revalidate: 3600
	}
);