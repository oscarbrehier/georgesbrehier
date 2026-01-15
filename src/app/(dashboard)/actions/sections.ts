"use server"

import { supabase } from "@/lib/supabase"
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

const createSlug = (text: string) => text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');

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

	if (data.is_default) {
		revalidateTag("default-section-with-collection", "max");
	};

	revalidatePath("/dashboard/gallery", "page");

	return { success: true, message: `Created \`${data.title}\`` };

};

export async function updateSection(sectionId: string, data: Omit<SectionUpdatePayload, "slug">): Promise<{ error: string | null }> {

	let payload: SectionUpdatePayload = { ...data };

	if (data.title) {
		payload.slug = data.title?.toLocaleLowerCase().replace(/ /g, "-");
	};

	if (data.is_default) {

		const { error: resetError } = await supabase
			.from("sections")
			.update({ is_default: false })
			.neq("id", sectionId);

		if (resetError) {
			return { error: resetError.message }
		};

	};

	const { error } = await supabase
		.from("sections")
		.update(payload)
		.eq("id", sectionId);

	if (error) return { error: error.message };


	revalidateTag("sections", "max");

	if (data.is_default) {
		revalidateTag("default-section-with-collection", "max");
	};

	revalidatePath("/");
	revalidatePath("/dashboard/sections");

	return { error: null };

};

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

export async function updateSectionPositions(changes: { id: string; position: number }[]): Promise<{ error: string | null }> {

	const { error } = await supabase.rpc("update_section_positions", {
		payload: changes
	});

	if (error) return { error: error.message };
	return { error: null };

};