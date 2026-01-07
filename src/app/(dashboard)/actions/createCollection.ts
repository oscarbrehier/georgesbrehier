"use server"

import { supabase } from "@/lib/supabase";
import { revalidatePath, revalidateTag } from "next/cache";

export interface CollectionFormState {
	success?: boolean;
	message?: string;
	error?: string;
}

export async function createCollection(prevState: CollectionFormState | undefined, formData: FormData) {

	const isDefault = formData.get("isDefault") === "on";
	const sectionId = formData.get("sectionId")?.toString();
	const title = formData.get("collectionTitle")?.toString().toLocaleLowerCase();
	const slug = title?.toLocaleLowerCase().replace(/ /g, "-");

	if (!sectionId || !title) return { error: "Missing fields required `sectionId` or `collectionTitle.`" };

	if (isDefault) {

		const { error } = await supabase
			.from("collections")
			.update({ is_default: false })
			.eq("is_default", true);

		if (error) return { error: error.message };

	};

	const { error } = await supabase
		.from("collections")
		.insert({ title, slug, section_id: sectionId, is_default: isDefault });

	if (error) {

		if (error.code === "23505") {
			return { error: `A collection named \`${title}\` already exists`}
		};

		return { error: error.message };

	};

	revalidateTag("collections", "max");
	revalidateTag(`section-${sectionId}-collections`, "max");

	if (isDefault) {
		revalidateTag(`section-${sectionId}-default-collection`, "max");
	};

	return { success: true, message: `Successfully created collection \`${title}\`` };

};