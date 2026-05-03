"use server";

import { createClient } from "@/utils/supabase/server";
import { captureException } from "@sentry/nextjs";
import { revalidateTag } from "next/cache";

interface UploadData {
  title: string;
  description: string;
  image_url: string;
  collection_id: string;
  width?: number;
  height?: number;
  image_width: number;
  image_height: number;
  cloudinary_public_id: string;
}

export async function uploadToGalleryBatch(items: UploadData[]): Promise<{
  error: string | null;
}> {
  if (items.length === 0) return { error: null };

  try {
    const supabase = await createClient();

    const { error } = await supabase.from("works").insert(items);

    if (error) {
      captureException(new Error(`Supabase batch insert failed: ${error.message}`), {
        extra: {
          errorCode: error.code,
          itemCount: items.length
        }
      });
      
      return { error: error.message };
    }

    revalidateTag("sections", "max");

    const collectionId = items[0].collection_id;
    revalidateTag(`collection-${collectionId}-gallery`, "max");

    return { error: null };
  } catch (err) {
    console.log(err);
    captureException(err);
    
    return { error: err instanceof Error ? err.message : "Upload failed" };
  }
}
