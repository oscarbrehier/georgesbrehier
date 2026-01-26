"use server"

import { supabase } from "@/lib/supabase";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function migrate_images() {

	const { data: items, error } = await supabase
		.from("works")
		.select("id, title, image_url");

	console.log("hello")

	if (error) {
		console.error(error);
		return { error: error.message };
	};

	const supabaseItems = items
		.filter(i => i.image_url.includes("supabase"))

	console.log(`found ${supabaseItems.length} image to migrate`);

	for (const item of supabaseItems) {

		try {

			console.log(`migrating: ${item.title}`);

			const uploadRes = await cloudinary.uploader.upload(item.image_url, {
				folder: "portfolio",
				tags: ['artwork'],
				context: `supabase_id=${item.id}`
			});

			const { error: updateError } = await supabase
				.from("works")
				.update({
					image_url: uploadRes.secure_url,
					width: uploadRes.width,
					height: uploadRes.height,
					cloudinary_public_id: uploadRes.public_id
				})
				.eq('id', item.id);

			if (updateError) console.log(`db upload error for ${item.id}:`, updateError);
			else console.log(`success ${item.title}`);

		} catch (err) {
			console.log(`failed to migrate ${item.id}:`, err);
		};

	};

};

migrate_images();