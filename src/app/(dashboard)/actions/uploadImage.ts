"use server"

import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
	cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
	api_key: process.env.CLOUDINARY_API_KEY,
	api_secret: process.env.CLOUDINARY_API_SECRET
});

export interface UploadImageState {
	url: string | null;
	error: string | null;
};

export async function uploadImage(file: File): Promise<UploadImageState> {

	if (!file) return { url: null, error: "No was file uploaded" };
	
	try {
		
			const arrayBuffer = await file.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);
			const base64File = `data:${file.type};base64,${buffer.toString("base64")}`;
		
		const res = await cloudinary.uploader.upload(base64File, {
			folder: "portfolio",
			tags: ['artwork']
		});

		return { url: res.secure_url, error: null };

	} catch (err) {

		console.error("Cloudinary image upload failed:", err);

		const message = err instanceof Error ? err.message : "Upload failed";
		return { url: null, error: message };

	};

};