"use server"

import { supabase } from "@/lib/supabase";
import { revalidateTag } from "next/cache";

export interface SectionFormState {
	success?: boolean;
	message?: string;
	error?: string;
}

export async function createSection(prevState: SectionFormState | undefined, formData: FormData) {

	const isDefault = formData.get("isDefault") === "on";
	const title = formData.get("sectionTitle")?.toString();
	const slug = title?.toLocaleLowerCase().replace(/ /g, "-");

	if (isDefault) {

		const { error } = await supabase
			.from("sections")
			.update({ is_default: false })
			.eq("is_default", true);

		if (error) return { error: error.message };

	};

	const { error } = await supabase
		.from("sections")
		.insert({ title, slug, is_default: isDefault });

	if (error) {

		if (error.code === "23505") {
			return { error: `A section named \`${title}\` already exists` }
		};

		return { error: error.message };

	};

	revalidateTag("sections", "max");

	if (isDefault) {
		revalidateTag("default-section", "max");
	};

	return { success: true, message: `Successfully created section \`${title}\`` };

};