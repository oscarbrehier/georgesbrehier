"use server"

import { supabase } from "@/lib/supabase";
import { cacheLife, cacheTag } from 'next/cache';
import { fetchSupabase } from "./fetchSupabase";

export async function getSections(): Promise<GallerySection[]> {

	"use cache"
	cacheTag("sections");
	cacheLife("hours");

	const { data, error } = await supabase
		.from("sections")
		.select("*");

	if (error) return [];
	return data;

};


export async function getSection(slug: string): Promise<GallerySection | null> {

	"use cache"
	cacheTag(`section-slug-${slug}`);
	cacheLife("hours");

	let sections = await fetchSupabase<GallerySection>(
		"sections",
		{ slug },
		"*",
		true
	);

	return sections;

};

export async function getDefaultSection(): Promise<GallerySection | null> {

	"use cache"
	cacheTag(`default-section`);
	cacheLife("hours");

	const { data, error } = await supabase
		.from("sections")
		.select("*")
		.eq("is_default", true)
		.single();

	if (error) {
		console.error("Error fetching default section:", error);
		return null;
	};

	return data;

};