"use server"
import { supabase } from "@/lib/supabase";
import { cacheLife, cacheTag } from "next/cache";
import { fetchSupabase } from "./fetchSupabase";

export async function getCollectionId(slug: string): Promise<string | null> {

    "use cache"
    cacheTag(`lookup-collection-${slug}`);
    cacheLife("days");

    const { data, error } = await supabase
        .from("collections")
        .select("id")
        .eq("slug", slug)
        .single();

    return error ? null : data.id;

};

export async function getCollectionsBySection(sectionId: string): Promise<GalleryCollection[]> {

    "use cache"
    cacheTag(`section-${sectionId}-collections`);
    cacheLife("hours");

    if (!sectionId) return [];

    const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("section_id", sectionId);

    if (error) return [];
    return data;

};

export async function getCollectionMetadata(collectionId: string): Promise<GalleryCollectionWithSection | null> {

    "use cache"
    cacheTag(`collection-${collectionId}-metadata`);
    cacheLife("hours");

    return await fetchSupabase<GalleryCollectionWithSection>(
        "collections",
        { "id": collectionId },
        `
            id,
            slug,
            title,
            is_default,
            seo_title,
            seo_description,
            seo_og_image_url,
            seo_og_image_width,
            seo_og_image_height,
            seo_og_image_alt,
            seo_twitter_image_url,
            seo_twitter_image_type,
            seo_canonical_url,
            seo_robots,
            section:sections!inner (
                id,
                slug,
                title
            )
        `,
        true
    );

};

export async function getCachedDefaultCollectionBySectionId(sectionId: string): Promise<GalleryCollectionWithSection | null> {

    "use cache"
    cacheTag(`section-${sectionId}-collections`);
    cacheLife("hours");

    return await getDefaultCollectionBySectionId(sectionId);

};

export async function getDefaultCollectionBySectionId(sectionId: string): Promise<GalleryCollectionWithSection | null> {

    return await fetchSupabase<GalleryCollectionWithSection>(
        "collections",
        { section_id: sectionId, is_default: true },
        `
            id,
            slug,
            title,
            is_default,
            section:sections!inner (
                id,
                slug
            )
        `,
        true
    );

};