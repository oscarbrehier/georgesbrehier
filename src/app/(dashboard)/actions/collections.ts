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
		.select("slug, section_id")
		.eq("id", collectionId)
		.single();

	let payload: CollectionUpdatePayload = { ...data };
	if (data.title) {
		payload.slug = createSlug(data.title);
	};

	const { data: updatedCollection, error } = await supabase
		.from("collections")
		.update(payload)
		.eq("id", collectionId)
		.select("section_id, slug")
		.single();

	if (error) return { error: error.message };
	const sectionId = updatedCollection.section_id;

	if (data.is_default) {

		await supabase
			.from("collections")
			.update({ is_default: false })
			.eq("section_id", sectionId)
			.neq("id", collectionId);

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

	revalidateTag(`section-${sectionId}-collections`, "max");
	if (shouldBeDefault) revalidateTag("site-home", "max");

	revalidatePath("/dashboard/gallery", "page");

	return { success: true, message: `Successfully created "${title}"${shouldBeDefault ? " as the section default" : ""}.` };

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