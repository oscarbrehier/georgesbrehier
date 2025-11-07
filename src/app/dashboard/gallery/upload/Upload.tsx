"use client"

import type React from "react";
import { useState } from "react";
import { Cloud, Loader2, Check, AlertCircle } from "lucide-react";

interface UploadFormData {
	title: string
	description: string
	section: string
	image: File | null
	imagePreview: string | null
};

export function Upload() {

	const [formData, setFormData] = useState<UploadFormData>({
		title: "",
		description: "",
		section: "",
		image: null,
		imagePreview: null,
	});

	const [isDragging, setIsDragging] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [uploadStatus, setUploadStatus] = useState<"idle" | "success" | "error">("idle");

	const handleDragEnter = (e: React.DragEvent) => {

		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);

	};

	const handleDragLeave = (e: React.DragEvent) => {

		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);

	};

	const handleDragOver = (e: React.DragEvent) => {

		e.preventDefault();
		e.stopPropagation();

	};

	const processImage = (file: File) => {

		if (file.type.startsWith("image/")) {

			setFormData((prev) => ({
				...prev,
				image: file,
				imagePreview: URL.createObjectURL(file),
			}))

			setIsDragging(false);

		};

	};

	const handleDrop = (e: React.DragEvent) => {

		e.preventDefault();
		e.stopPropagation();

		const files = e.dataTransfer.files;

		if (files.length > 0) {
			processImage(files[0]);
		};

	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

		const files = e.currentTarget.files;

		if (files && files.length > 0) {
			processImage(files[0]);
		};

	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

		const { name, value } = e.currentTarget;

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

	};


	async function uploadImage(file: File) {

		if (!file) return;

		try {

			const formData = new FormData();
			formData.append("file", file);

			const res = await fetch("/api/gallery/upload", {
				method: "POST",
				body: formData
			});

			const data = await res.json();
			return data.url;

		} catch (err) {

			console.error(err);

		};


	};

	async function uploadToGallery(imageUrl: string) {

		const { title, description, section } = formData;

		try {
		
			const res = await fetch("/api/gallery", {
				method: "POST",
				body: JSON.stringify({
					image_url: imageUrl,
					title,
					description,
					section
				})
			});
 
			if (!res.ok) {
				console.error("Failed to upload to gallery:", res.status);
				return ;
			};

			const data = await res.json();
			console.log(data);
			
		} catch (err) {

			console.error(err);

		};

	};

	const handleSubmit = async (e: React.FormEvent) => {

		e.preventDefault();

		if (!formData.image || !formData.title || !formData.description || !formData.section) {

			setUploadStatus("error");
			setTimeout(() => setUploadStatus("idle"), 3000);

			return;

		};

		setIsLoading(true);

		const imageUrl = await uploadImage(formData.image);
		await uploadToGallery(imageUrl);

		// setTimeout(() => {
		// 	setIsLoading(false)
		// 	setUploadStatus("success")

		// 	setTimeout(() => {
		// 		setFormData({
		// 			title: "",
		// 			description: "",
		// 			section: "",
		// 			image: null,
		// 			imagePreview: null,
		// 		})
		// 		setUploadStatus("idle")
		// 	}, 2000)
		// }, 1500);

	};

	return (

		<div className="h-screen p-6 md:p-12  flex items-center justify-center">

			<div className="w-full max-w-2xl">

				{/* <div className="mb-12 text-center">

					<h1 className="text-5xl md:text-6xl font-light text-slate-900 mb-2 tracking-tight">
						Upload
					</h1>

				</div> */}

				<form onSubmit={handleSubmit} className="space-y-8">

					<div
						onDragEnter={handleDragEnter}
						onDragLeave={handleDragLeave}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
						className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ease-out ${isDragging
							? "border-slate-400 bg-slate-100"
							: "border-slate-200"
							} ${formData.imagePreview ? "bg-slate-50" : "bg-white"}`}
					>

						<input
							id="image_input_change"
							type="file"
							accept="image/*"
							onChange={handleFileInputChange}
							className="hidden"
						/>


						{formData.imagePreview ? (

							<div className="relative overflow-hidden rounded-xl">

								<img
									src={formData.imagePreview || "/placeholder.svg"}
									alt="Preview"
									className="w-full h-80 object-cover"
								/>

								<div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors flex items-center justify-center">

									<button
										type="button"
										onClick={() => document.getElementById("image_input_change")?.click()}
										className="opacity-0 hover:opacity-100 transition-opacity bg-white/90 text-slate-900 px-4 py-2 rounded-lg font-medium text-sm z-20"
									>
										Change image
									</button>

								</div>

							</div>

						) : (

							<div className="px-12 py-8 text-center">

								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
									<Cloud className="w-8 h-8 text-slate-600" />

								</div>

								<h3 className="text-lg font-medium text-slate-900 mb-2">Drag your image here</h3>
								<p className="text-sm text-slate-600 mb-4">or click to browse</p>

								<label htmlFor="image_input" className="inline-block">

									<span className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white font-medium text-sm cursor-pointer hover:bg-slate-800 transition-colors">
										Select image
									</span>

									<input
										id="image_input"
										type="file"
										accept="image/*"
										onChange={handleFileInputChange}
										className="hidden"
									/>
								</label>

							</div>

						)}

					</div>

					<div className="space-y-6">

						<div>

							<label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
								Title
							</label>

							<input
								id="title"
								type="text"
								name="title"
								value={formData.title}
								onChange={handleInputChange}
								className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
							/>

						</div>

						<div>

							<label
								htmlFor="description"
								className="block text-sm font-medium text-slate-700 mb-2"
							>
								Description
							</label>

							<textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								rows={2}
								className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all resize-none"
							/>

						</div>

						<div>

							<label htmlFor="section" className="block text-sm font-medium text-slate-700 mb-2">
								Section
							</label>

							<select
								id="section"
								name="section"
								value={formData.section}
								onChange={handleInputChange}
								className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all appearance-none cursor-pointer"
							>

								<option value="">Choose a section</option>
								<option value="sculptures">Sculptures</option>
								{/* <option value="lamps">Lampes</option>
								<option value="paintings">Peintures</option> */}

							</select>
						</div>

					</div>

					{uploadStatus === "error" && (

						<div className="flex items-center gap-3 p-4 rounded-lg bg-red-50 border border-red-200">

							<AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
							<p className="text-sm text-red-600">Please fill in all fields and select an image</p>

						</div>

					)}

					{uploadStatus === "success" && (
						<div className="flex items-center gap-3 p-4 rounded-lg bg-green-50 border border-green-200">

							<Check className="w-5 h-5 text-green-600 flex-shrink-0" />
							<p className="text-sm text-green-600">Upload successful!</p>

						</div>
					)}

					<button

						type="submit"
						disabled={isLoading}
						className="w-full py-3 px-6 rounded-lg bg-slate-900 text-white font-medium transition-all duration-200 hover:bg-slate-800disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>
						{isLoading ? (
							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								Uploading...
							</>
						) : (
							"Upload"
						)}

					</button>


				</form>
			</div>

		</div>

	);
};
