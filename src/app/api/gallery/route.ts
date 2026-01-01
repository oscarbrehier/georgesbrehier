import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

	const body = await req.json();
	const { title, description, image_url, collectionId } = body;

	const { data, error } = await supabase
		.from("works")
		.insert([{ title, description, image_url, collection_id: collectionId }])
		.select();

	if (error) return NextResponse.json({ error: error.message }, { status: 500 });

	revalidatePath(`gallery-collection-${collectionId}`)

	return NextResponse.json({ data }, { status: 200 });

};