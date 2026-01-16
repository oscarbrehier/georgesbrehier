"use server"

import { supabase } from "@/lib/supabase";
import { getDefaultCollectionBySectionId } from "@/utils/supabase/collections";
import { createSlug } from "@/utils/utils";
import { revalidatePath, revalidateTag } from "next/cache";

export interface CollectionFormState {
	success?: boolean;
	message?: string;
	error?: string;
};

async function hasDefaultCollection(sectionId: string): Promise<boolean> {

	const { count, error } = await supabase
		.from("collections")
		.select("id", { count: 'exact', head: true })
		.eq("section_id", sectionId)
		.eq("is_default", true);

	if (error) return false;
	return (count ?? 0) > 0;

};

export async function createCollection(prevState: CollectionFormState | undefined, formData: FormData) {

	const sectionId = formData.get("sectionId")?.toString();
	const rawTitle = formData.get("collectionTitle")?.toString().trim();

	if (!sectionId || !rawTitle) return { error: "Collection title and Section ID are required." };

	const title = rawTitle?.toLocaleLowerCase();
	const slug = createSlug(title);
	const isExplicitDefault = formData.get("isDefault") === "on";

	let shouldBeDefault = isExplicitDefault;

	if (shouldBeDefault) {

		const { error } = await supabase
			.from("collections")
			.update({ is_default: false })
			.eq("section_id", sectionId)
			.eq("is_default", true);

		if (error) return { error: error.message };

	} else {

		const exists = await hasDefaultCollection(sectionId);
		if (!exists) shouldBeDefault = true;

	};

	const { error: insertError } = await supabase
		.from("collections")
		.insert({
			title,
			slug,
			section_id: sectionId,
			is_default: shouldBeDefault
		});

	if (insertError) {

		if (insertError.code === "23505") {
			return { error: `A collection named \`${title}\` already exists` }
		};

		return { error: insertError.message };

	};

	revalidateTag("collections", "max");
	revalidateTag(`section-${sectionId}-collections`, "max");

	if (shouldBeDefault) {
		revalidateTag(`section-${sectionId}-default-collection`, "max");
	};

	revalidatePath("/dashboard/gallery", "page");

	return { success: true, message: `Successfully created "${title}"${shouldBeDefault ? " as the section default" : ""}.` };

};