"use server"

import { supabase } from "@/lib/supabase";
import { revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteSection(slug: string): Promise<{ error: string | null }> {

	const { data, error } = await supabase
		.from("sections")
		.delete()
		.eq("slug", slug)
		.select("id");

	if (error) return { error: error.message };

	if (!data || data.length === 0) {
		return { error: `Section \`${slug}\` not found.` };
	};

	revalidateTag("sections", "max");
	redirect("/dashboard/gallery?section=all");

};