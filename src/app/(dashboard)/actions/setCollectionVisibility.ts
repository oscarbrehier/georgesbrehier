"use server"

import { supabase } from "@/lib/supabase"
import { revalidateTag } from "next/cache";

export async function setCollectionVisibility(collectionId: string, visible: boolean) {

	const { error } = await supabase
		.from("collections")
		.update({ visible })
		.eq("id", collectionId);

	revalidateTag(`gallery-collection-${collectionId}`, "max");

	if (error) throw new Error(error.message);

};