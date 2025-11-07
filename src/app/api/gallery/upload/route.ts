import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

	try {

		const formData = await req.formData();
		const fileEntry = formData.get("file");

		if (!fileEntry || !(fileEntry instanceof File)) {
			return new Response('No valid file provided', { status: 400 });
		};

		const file = fileEntry;

		const filename = `${Date.now()}-${file.name}`;
		const { error } = await supabase.storage
			.from("gallery_images")
			.upload(filename, file);

		if (error) return NextResponse.json({ error: error.message }, { status: 500 });

		const { publicUrl } = supabase.storage.from("gallery_images").getPublicUrl(filename).data;
		return NextResponse.json({ url: publicUrl }, { status: 200 });

	} catch (err) {

		return NextResponse.json({ error: (err as Error).message }, { status: 500 });

	};

};