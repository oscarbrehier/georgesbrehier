"use server"

import { supabase } from "@/lib/supabase";
import { cacheLife, cacheTag } from 'next/cache';
import { fetchSupabase } from "./fetchSupabase";

export async function getSectionId(slug: string): Promise<string | null> {

	"use cache"
	cacheTag(`lookup-section-${slug}`);
	cacheLife("days");

	const { data, error } = await supabase
		.from("sections")
		.select("id")
		.eq("slug", slug)
		.single();

	return error ? null : data.id;

};

export async function getSections(): Promise<GallerySection[]> {

	"use cache"
	cacheLife("seconds");

	const { data, error } = await supabase
		.from("sections")
		.select("*");

	if (error) return [];
	return data;

};

export async function getSectionsCached() {

	"use cache"
	cacheTag("sections");
	cacheLife("hours");

	return getSections();

};

export async function getNavSections(): Promise<SectionNavItem[]> {

	"use cache"
	cacheTag("sections");
	cacheLife("minutes");

	const { data, error } = await supabase
		.from("public_navigation")
		.select("*")
		.order("position", { ascending: true });

	if (error) {
		return [];
	};

	return data;

};

export async function getSection(sectionId: string): Promise<GallerySection | null> {

	"use cache"
	cacheTag(`section-${sectionId}`);
	cacheLife("hours");

	const { data, error } = await supabase
		.from("sections")
		.select("*")
		.eq("id", sectionId)
		.single();

	if (error || !data) return null;

	return data;

};

export async function getPublishedSection(sectionId: string): Promise<GallerySection | null> {

	"use cache"
	cacheTag(`section-${sectionId}`);
	cacheLife("hours");

	const { data, error } = await supabase
		.from("public_navigation")
		.select(`*`)
		.eq("id", sectionId)
		.single();

	if (error || !data) return null;

	return {
		...data,
		is_visible: true
	};

};

export async function getDefaultSectionWithCollection(): Promise<SectionWithDefaultCollection | null> {

	"use cache"
	cacheTag("site-home");
	cacheLife("hours");

	const { data, error } = await supabase
		.from("sections")
		.select(`
				*,
  				collections!inner(*)
			`)
		.eq("is_default", true)
		.filter("collections.is_default", "eq", true)
		.single();

	if (error) {
		console.error("Error fetching default section:", error);
		return null;
	};

	const flattened = {
		...data,
		defaultCollection: data.collections[0] ?? undefined
	};

	delete flattened.collections;

	return flattened;

};

export async function getSectionTree(value: string, type: "id" | "slug"): Promise<GallerySectionTree | null> {

	const { data, error } = await supabase
		.from("sections")
		.select(`
			id,
			slug,
			is_visible,
			collections (
        		id,
				title,
				slug,
				is_default,
				is_visible,
        		works (
          			*
        		)
      		)
		`)
		.eq(type, value)
		.single();

	if (error) {

		console.error("Error fetching full section tree:", error);
		return null;

	};

	return data;

};