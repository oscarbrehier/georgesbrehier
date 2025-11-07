import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

	const body = await req.json();
	const { title, description, image_url, section } = body;

	const { data, error } = await supabase
		.from("gallery_items")
		.insert([{ title, description, image_url, section }])
		.select();

	if (error) return NextResponse.json({ error: error.message }, { status: 500 });

	return NextResponse.json({ data }, { status: 200 });

};