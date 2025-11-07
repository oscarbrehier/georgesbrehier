import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {

	try {

		const request = req.clone();
		const formData = await request.formData();
		const fileEntry = formData.get("file");

		if (!fileEntry || !(fileEntry instanceof Blob)) {
			return NextResponse.json({ error: "No valid file provided" }, { status: 400 });
		};

		const file = fileEntry as Blob;

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const ext = file.type.split("/")[1] ?? "jpg";
		const filename = `${Date.now()}-upload.${ext}`;

		const { error } = await supabase.storage
			.from("gallery_images")
			.upload(filename, buffer);

		if (error) return NextResponse.json({ error: error.message }, { status: 500 });

		const { publicUrl } = supabase.storage.from("gallery_images").getPublicUrl(filename).data;
		return NextResponse.json({ url: publicUrl }, { status: 200 });

	} catch (err) {

		return NextResponse.json({ error: (err as Error).message }, { status: 500 });

	};

};