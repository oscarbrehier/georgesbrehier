"use server"

import { supabase } from "@/lib/supabase";
import { UI_LABELS } from "@/utils/constants";
import { createSlug } from "@/utils/utils";
import { revalidatePath, revalidateTag } from "next/cache";

export interface CollectionUpdatePayload {
	title?: string;
	slug?: string;
	is_default?: boolean;
	is_visible?: boolean;
	order?: number;
};

export interface CollectionFormState {
	success?: boolean;
	message?: string;
	error?: string;
};

export async function updateCollectionPositions(
	changes: { id: string; position: number; sectionId?: string }[]
): Promise<{ error: string | null }> {

	const { error } = await supabase.rpc("update_collection_positions", {
		payload: changes
	});

	if (error) {
		return { error: error.message };
	};

	const sectionIds = new Set(
		changes
			.map(c => c.sectionId)
			.filter((id): id is string => Boolean(id))
	);

	sectionIds.forEach((sectionId) => {
		revalidateTag(`section-${sectionId}-collections`, "max");
	});

	return { error: null };

};

export async function updateCollection(collectionId: string, data: Partial<CollectionUpdatePayload>): Promise<{ error: string | null }> {

	const { data: oldData } = await supabase
		.from("collections")
		.select("slug, section_id, is_default")
		.eq("id", collectionId)
		.single();

	if (!oldData) return { error: `${UI_LABELS.collection.capitalized} not found` };

	const isHidingDefault = (data.is_visible === false && oldData.is_default === true);
	const isUnsettingDefault = (data.is_default === false && oldData.is_default === true);

	if (isHidingDefault || isUnsettingDefault) {

		const { data: nextBest } = await supabase
			.from("collections")
			.select("id")
			.eq("section_id", oldData.section_id)
			.neq("id", collectionId)
			.order("is_visible", { ascending: false })
			.order("position", { ascending: true })
			.limit(1)
			.maybeSingle();

		if (!nextBest) {
			return { error: `This is the only ${UI_LABELS.collection.singular} in this ${UI_LABELS.section.singular}. It must remain visible and default.` };
		}

		await supabase
			.from("collections")
			.update({ is_default: true })
			.eq("id", nextBest.id);

	};

	let payload: CollectionUpdatePayload = { ...data };
	if (data.title) {
		payload.slug = createSlug(data.title);
	};

	const { data: updatedCollection, error } = await supabase
		.from("collections")
		.update(payload)
		.eq("id", collectionId)
		.select("section_id, is_default, slug")
		.single();

	if (error) {

		if (error.code === '23505') {
			return {
				error: `A ${UI_LABELS.collection.singular} named "${payload.title}" already exists in this ${UI_LABELS.section.singular}. Please give this ${UI_LABELS.collection.singular} a different name.`
			};
		};

		return { error: error.message };

	};

	const sectionId = updatedCollection.section_id;

	if (data.is_default === false && oldData.is_default === true) {

		const { data: nextBest } = await supabase
			.from("collections")
			.select("id")
			.eq("section_id", sectionId)
			.neq("id", collectionId)
			.order("is_visible", { ascending: false })
			.order("position", { ascending: true })
			.limit(1)
			.single();

		if (nextBest) {
			await supabase
				.from("collections")
				.update({ is_default: true })
				.eq("id", nextBest.id);
		};

	};

	if (data.is_default === true || isUnsettingDefault || isHidingDefault) {
		revalidateTag("site-home", "max");
	};

	revalidateTag(`section-${sectionId}-collections`, "max");
	revalidateTag(`collection-${collectionId}-metadata`, "max");

	if (oldData?.slug) revalidateTag(`lookup-collection-${oldData.slug}`, "max");
	if (updatedCollection.slug) revalidateTag(`lookup-collection-${updatedCollection.slug}`, "max");

	revalidatePath("/");
	revalidatePath(`/dashboard/sections/${sectionId}`);

	return { error: null };

};

export async function createCollection({
	sectionId,
	title: rawTitle,
	is_default
}: {
	sectionId: string;
	title: string;
	is_default: boolean;
}) {

	if (!sectionId || !rawTitle) return { error: `${UI_LABELS.collection.capitalized} title and ${UI_LABELS.section.singular} ID are required.` };

	const title = rawTitle.trim().toLocaleLowerCase();
	const slug = createSlug(title);

	const { data: newCol, error: insertError } = await supabase
		.from("collections")
		.insert({
			title,
			slug,
			section_id: sectionId,
			is_default
		})
		.select("is_default")
		.single();

	if (insertError) {

		if (insertError.code === "23505") {
			return { error: `A ${UI_LABELS.collection.singular} named "${rawTitle}" already exists in this ${UI_LABELS.section.singular}. Please give this ${UI_LABELS.collection.singular} a different name.` }
		};

		return { error: insertError.message };

	};

	const actualDefault = newCol.is_default;

	revalidateTag(`section-${sectionId}-collections`, "max");
	if (actualDefault) revalidateTag("site-home", "max");

	revalidatePath("/dashboard", "page");

	return {
		success: true,
		message: `Successfully created "${title}"${actualDefault ? ` as the ${UI_LABELS.section.singular} default` : ""}.`
	};

};

export async function setCollectionVisibility(collectionId: string, sectionId: string, visible: boolean) {

	const { error } = await supabase
		.from("collections")
		.update({ is_visible: visible })
		.eq("id", collectionId);

	revalidateTag(`section-${sectionId}-collections`, "max");
	revalidateTag(`collection-${collectionId}-gallery`, "max");

	if (error) throw new Error(error.message);

};

export async function deleteCollection(collectionId: string, sectionId: string): Promise<{ error: string | null }> {

	const { data: colToDelete } = await supabase
		.from("collections")
		.select("is_default, slug")
		.eq("id", collectionId)
		.single();

	if (!colToDelete) return { error: `${UI_LABELS.collection.capitalized} not found` };

	const { error: deleteError } = await supabase
		.from("collections")
		.delete()
		.eq("id", collectionId);

	if (deleteError) return { error: deleteError.message };

	if (colToDelete.is_default) {

		const { data: nextBest } = await supabase
			.from("collections")
			.select("id")
			.eq("section_id", sectionId)
			.order("is_visible", { ascending: false })
			.order("position", { ascending: true })
			.limit(1)
			.single();

		if (nextBest) {
			await supabase
				.from("collections")
				.update({ is_default: true })
				.eq("id", nextBest.id);
		};

		revalidateTag("site-home", "max");

	};

	revalidateTag(`section-${sectionId}-collections`, "max");
	revalidateTag(`lookup-collection-${colToDelete.slug}`, "max");
	revalidatePath(`/dashboard/sections/${sectionId}`);

	return { error: null };

};