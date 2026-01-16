"use server"

import { supabase } from "@/lib/supabase";
import { createSlug } from "@/utils/utils";
import { revalidatePath, revalidateTag } from "next/cache";

export interface CollectionUpdatePayload {
	title?: string;
	slug?: string;
	is_default?: boolean;
	is_visible?: boolean;
	order?: number;
};

export async function updateCollectionPositions(
	changes: { id: string; position: number }[]
): Promise<{ error: string | null }> {

	const { error } = await supabase.rpc("update_collection_positions", {
		payload: changes
	});

	if (error) {
		return { error: error.message };
	};

	return { error: null };

};

export async function updateCollection(collectionId: string, data: Partial<CollectionUpdatePayload>): Promise<{ error: string | null }> {

	let payload: CollectionUpdatePayload = { ...data };

	if (data.title) {
		payload.slug = createSlug(data.title);
	};

	const { data: updatedCollection, error } = await supabase
		.from("collections")
		.update(payload)
		.eq("id", collectionId)
		.select("section_id")
		.single();

	if (error) return { error: error.message };

	const sectionId = updatedCollection.section_id;

	if (data.is_default) {

		const { error: resetError } = await supabase
			.from("collectionId")
			.update({ is_default: false })
			.eq("section_id", sectionId)
			.neq("id", collectionId);

		if (resetError) {
			return { error: resetError.message }
		};

	};

	if (data.is_default) revalidateTag(`section-${sectionId}-default-collection`, "max");
	revalidateTag(`section-${sectionId}-collection`, "max");
	revalidatePath("/");
	revalidatePath(`/dashboard/sections/${sectionId}`);

	return { error: null };

};