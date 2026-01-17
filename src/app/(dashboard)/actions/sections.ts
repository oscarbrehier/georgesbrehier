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
	order?: number;
};

interface SectionCreatePaylod {
	title: string;
	is_default: boolean;
};

export async function createSection(data: SectionCreatePaylod) {

	const slug = createSlug(data.title)

	if (data.is_default) {

		await supabase
			.from("sections")
			.update({ is_default: false })
			.eq("is_default", true);

	};

	const { error } = await supabase
		.from("sections")
		.insert({ ...data, slug });

	if (error?.code === "23505") return { error: "A section with this title already exists." };
	if (error) return { error: error.message };

	revalidateTag("sections", "max");
	if (data.is_default) revalidateTag("site-home", "max");

	revalidatePath("/dashboard/gallery", "page");

	return { success: true, message: `Created \`${data.title}\`` };

};

export async function updateSection(sectionId: string, data: Omit<SectionUpdatePayload, "slug">): Promise<{ error: string | null }> {

	const { data: oldData } = await supabase
		.from("sections")
		.select("slug, section_id")
		.eq("id", sectionId)
		.single();

	let payload: SectionUpdatePayload = { ...data };

	if (data.title) {
		payload.slug = createSlug(data.title);
	};

	if (data.is_default) {

		await supabase
			.from("sections")
			.update({ is_default: false })
			.neq("id", sectionId)
			.eq("is_default", true);

		revalidateTag("site-home", "max");

	};

	const { data: updatedSection, error } = await supabase
		.from("sections")
		.update(payload)
		.eq("id", sectionId)
		.select("slug")
		.single();

	if (error) return { error: error.message };


	revalidateTag("sections", "max");
	revalidateTag(`section-${sectionId}`, "max");

	if (oldData?.slug) revalidateTag(`lookup-section-${oldData.slug}`, "max");
	if (updatedSection.slug) revalidateTag(`lookup-section-${updatedSection.slug}`, "max");

	revalidatePath("/");
	revalidatePath("/dashboard/sections");

	return { error: null };

};

export async function deleteSection(sectionId: string): Promise<{ error: string | null }> {

	const { data, error } = await supabase
		.from("sections")
		.delete()
		.eq("id", sectionId)
		.select("slug")
		.single();

	if (error) return { error: error.message };

	revalidateTag("sections", "max");
	revalidateTag(`section-${sectionId}`, "max");

	if (data.slug) revalidateTag(`lookup-section-${data.slug}`, "max");

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