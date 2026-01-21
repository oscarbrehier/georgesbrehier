"use server"

import { supabase } from "@/lib/supabase"
import { createSlug } from "@/utils/utils";
import { revalidatePath, revalidateTag } from "next/cache";
import { redirect } from "next/navigation";

export interface SectionUpdatePayload {
	title?: string;
	slug?: string;
	is_default?: boolean;
	is_visible?: boolean;
	position?: number;
};

interface SectionCreatePaylod {
	title: string;
	is_default: boolean;
};

export async function createSection(data: SectionCreatePaylod) {

	const slug = createSlug(data.title)

	const { data: newSection, error } = await supabase
		.from("sections")
		.insert({ ...data, slug })
		.select("is_default")
		.single();

	if (error?.code === "23505") return { error: `The title "${data.title}" is already being used for another section. Please choose a unique name for this section.` };
	if (error) return { error: error.message };

	const actualDefault = newSection.is_default;

	revalidateTag("sections", "max");
	if (actualDefault) revalidateTag("site-home", "max");

	revalidatePath("/dashboard/gallery", "page");

	return { success: true, message: `Created \`${data.title}\`` };

};

export async function updateSection(sectionId: string, data: Omit<SectionUpdatePayload, "slug">): Promise<{ error: string | null }> {

	const { data: oldData } = await supabase
		.from("sections")
		.select("slug, is_default")
		.eq("id", sectionId)
		.single();

	if (!oldData) return { error: "Section not found" };

	const isHidingDefault = data.is_visible === false && oldData.is_default === true;
	const isUnsettingDefault = data.is_default === false && oldData.is_default === true;

	if (isHidingDefault || isUnsettingDefault) {

		const { data: nextBest } = await supabase
			.from("sections")
			.select("id")
			.neq("id", sectionId)
			.order("is_visible", { ascending: false })
			.order("position", { ascending: true })
			.limit(1)
			.maybeSingle();

		if (!nextBest) {
			return { error: "This is the only section. It must remain visible and default." };
		}

		await supabase
			.from("sections")
			.update({ is_default: true })
			.eq("id", nextBest.id);

	};

	let payload: SectionUpdatePayload = { ...data };

	if (data.title) {
		payload.slug = createSlug(data.title);
	};

	const { data: updatedSection, error } = await supabase
		.from("sections")
		.update(payload)
		.eq("id", sectionId)
		.select("slug, is_default")
		.single();

	if (error) {

		if (error.code === '23505') {
			return {
				error: `The title "${payload.title}" is already being used for another section. Please choose a unique name for this section.`
			};
		};
	
		return { error: error.message };
	
	};

	if (data.is_default === true || isUnsettingDefault || isHidingDefault) {
		revalidateTag("site-home", "max");
	};

	revalidateTag("sections", "max");
	revalidateTag(`section-${sectionId}`, "max");


	if (oldData?.slug) revalidateTag(`lookup-section-${oldData.slug}`, "max");
	if (updatedSection.slug) revalidateTag(`lookup-section-${updatedSection.slug}`, "max");

	revalidatePath("/");
	revalidatePath("/dashboard/sections");

	return { error: null };

};

export async function deleteSection(sectionId: string): Promise<{ error: string | null }> {

	const { data: section } = await supabase
		.from("sections")
		.select("is_default, slug")
		.eq("id", sectionId)
		.single();

	if (!section) return { error: "Section not found" };

	const { error } = await supabase
		.from("sections")
		.delete()
		.eq("id", sectionId);

	if (error) return { error: error.message };

	if (section.is_default) {

		const { data: nextBest } = await supabase
			.from("sections")
			.select("id")
			.order("is_visible", { ascending: false })
			.order("position", { ascending: true })
			.limit(1)
			.single();

		if (nextBest) {
			await supabase
				.from("sections")
				.update({ is_default: true })
				.eq("id", nextBest.id);
		};

		revalidateTag("site-home", "max");

	};

	revalidateTag("sections", "max");
	revalidateTag(`lookup-section-${section.slug}`, "max");

	redirect("/dashboard/sections");

};

export async function updateSectionPositions(
	changes: { id: string; position: number }[]
): Promise<{ error: string | null }> {

	const { error } = await supabase.rpc("update_section_positions", {
		payload: changes
	});

	if (error) return { error: error.message };

	revalidateTag("sections", "max");

	revalidatePath("/dashboard/sections", "page");

	return { error: null };

};