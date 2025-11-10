import { supabase } from "@/lib/supabase";

export async function getSectionBy(selector: string, value: string): Promise<GallerySection | null> {

	if (!selector || !value) return null;

	const { data, error } = await supabase
		.from("sections")
		.select("*")
		.eq(selector, value);

	if (error || data.length === 0) return null;
	return data[0];
 
};