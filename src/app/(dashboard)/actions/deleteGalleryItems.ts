"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath, revalidateTag } from "next/cache";
import { captureException } from "@sentry/nextjs";

export async function deleteGalleryItem(
  item: GalleryItemToDelete,
  path: string,
) {
  return deleteGalleryItems([item], path);
}

export async function deleteGalleryItems(
  items: GalleryItemToDelete[],
  path: string,
): Promise<{ error: null | string; count: number }> {
  if (!items.length) return { error: null, count: 0 };

  const itemIds = items.map((item) => item.id);

  const { data, error } = await supabase
    .from("works")
    .delete()
    .in("id", itemIds)
    .select("id");

  await Promise.all(
    items.map((item) =>
      revalidateTag(`collection-${item.collectionId}-gallery`, "max"),
    ),
  );

  if (error) {
    captureException(new Error(`deleteGalleryItems Failed: ${error.message}`), {
      extra: { errorCode: error.code },
    });

    return {
      error: error?.message,
      count: 0,
    };
  }

  revalidatePath(path);

  return { error: null, count: data?.length ?? 0 };
}
