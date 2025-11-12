"use server"

import { supabase } from "@/lib/supabase";
import { cacheTag } from "next/cache";

export async function getCollectionsBySection(selector: string, value: string): Promise<GalleryCollection | null> {

	if (!selector || !value) return null;

	const { data, error } = await supabase
		.from("collections")
		.select("*")
		.eq(selector, value);

	if (error || data.length === 0) return null;
	return data[0];

};

export async function getCollectionByTitle(title: string): Promise<GalleryCollection | null> {

	if (!title) return null;

	const { data, error } = await supabase
		.from("collections")
		.select("*")
		.eq("title", title);

	if (error || data.length === 0) return null;
	return data[0];

}

export async function getCollectionsBySectionId(sectionId: string): Promise<GalleryCollection[] | null> {

	'use cache'
	cacheTag("collections");

	if (!sectionId) return null;

	const { data, error } = await supabase
		.from("collections")
		.select("*")
		.eq("section_id", sectionId);

	if (error) return null;
	return data;

};