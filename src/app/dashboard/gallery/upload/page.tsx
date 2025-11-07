"use client"

import { roboto } from "@/utils/fonts";
import { CloudUpload } from "lucide-react";
import { useState } from "react";
import { Upload } from "./Upload";

export default function Page() {

	const [file, setFile] = useState<File | null>(null);
	const [isDragging, setIsDragging] = useState(false);

	async function upload() {

		if (!file) return;

		try {

			const formData = new FormData();
			formData.append("file", file);

			const res = await fetch("/api/gallery/upload", {
				method: "POST",
				body: formData
			});

			const data = await res.json();
			console.log(data.url);

		} catch (err) {

			console.error(err);

		};


	};

	return (

		<Upload />

		// <div className="h-screen w-full p-8 text-black flex flex-col items-center">

		// 	<div className="h-auto w-1/2  space-y-10">

		// 		<div className="">

		// 			<p className={`${roboto.className} text-3xl font-semibold`}>Upload to gallery</p>

		// 		</div>

		// 		<div>

		// 			<div className="space-y-2">

		// 				<div
		// 					className={`border-neutral-300 border-3 border-dashed rounded-lg p-16 text-center transition-all cursor-pointer ${isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
		// 						}`}
		// 				>

		// 					<input
		// 						type="file"
		// 						id="file-input"
		// 						onChange={(e) => setFile(e.target.files?.[0] ?? null)}
		// 						className="hidden"
		// 						accept="video/*,.jpeg,.jpg,.png"
		// 					/>

		// 					<label htmlFor="file-input" className="w-full h-auto cursor-pointer space-y-4 flex justify-center items-center flex-col">

		// 						<div className="bg-amber-400 rounded-full p-4 flex-none">
		// 							<Upload className="text-neutral-800" />
		// 						</div>

		// 						<p className="text-neutral-700 font-semibold">
		// 							Drag & Drop or
		// 							&nbsp;
		// 							<span className="text-amber-600">Choose file</span>
		// 							&nbsp;
		// 							to upload
		// 						</p>
		// 						{/* <h2 className="text-lg font-semibold mb-2">Drop your file here</h2>
		// 						<p className="text-sm mb-4">or click to browse from your computer</p>
		// 						<p className="text-xs">Supported: JPEG, PNG</p> */}

		// 					</label>

		// 				</div>

		// 			</div>

		// 		</div>

		// 	</div>

		// 	{/* <input
		// 		onChange={(e) => setFile(e.target.files?.[0] ?? null)}
		// 		type="file"
		// 		accept="image/*"
		// 	/>

		// 	<button
		// 		onClick={upload}
		// 	>
		// 		upload
		// 	</button> */}

		// </div>

	);

};