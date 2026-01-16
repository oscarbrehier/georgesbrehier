"use server"
import { supabase } from "@/lib/supabase";
import { cacheLife, cacheTag } from "next/cache";
import { fetchSupabase } from "./fetchSupabase";


export async function getCollectionBySection(identifier: string): Promise<GalleryCollection[]> {

    // "use cache"
    // cacheTag(`section-${identifier}-collections`);
    // cacheLife("hours");

    if (!identifier) return [];

    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(identifier);
    let sectionId = identifier;

    if (!isUuid) {

        const { data: section, error: sError } = await supabase
            .from("sections")
            .select("id")
            .eq("slug", identifier)
            .single();

        if (sError || !section) return [];
        sectionId = section.id;

    };

    console.log(sectionId)

    const { data, error } = await supabase
        .from("collections")
        .select("*")
        .eq("section_id", sectionId);

    if (error) {
        return [];
    };

    return data as GalleryCollection[];

};

export async function getCollectionsBySectionId(sectionId: string): Promise<GalleryCollection[]> {

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

export async function getCollectionMetadata(collection: string): Promise<GalleryCollectionWithSection | null> {

    "use cache"
    cacheTag(`collection-metadata-${collection}`);
    cacheLife("hours");

    return await fetchSupabase<GalleryCollectionWithSection>(
        "collections",
        { "slug": collection },
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
    cacheTag(`section-${sectionId}-default-collection`);
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