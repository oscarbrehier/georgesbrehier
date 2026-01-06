import { supabase } from "@/lib/supabase";
import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

	const body = await req.json();
	const { title, description, image_url, collectionId } = body;

	const { data, error } = await supabase
		.from("works")
		.insert([{ title, description, image_url, collection_id: collectionId }])
		.select();

	if (error) return NextResponse.json({ error: error.message }, { status: 500 });

	revalidateTag(`gallery-collection-${collectionId}`, "max")

	return NextResponse.json({ data }, { status: 200 });

};