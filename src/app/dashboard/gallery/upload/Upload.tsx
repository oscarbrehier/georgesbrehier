"use client"

import type React from "react";
import { useState } from "react";
import { Cloud, Loader2, Check, X, Image as ImageIcon } from "lucide-react";
import { getCollectionsBySectionId } from "@/utils/supabase/getCollection";

interface UploadFormData {
	title: string
	description: string
	sectionId: string
	collectionId: string
	images: File[]
	imagePreviews: string[]
}

interface UploadProgress {
	filename: string
	status: "pending" | "uploading" | "success" | "error"
	error?: string
}

export function Upload({
	sections
}: {
	sections: GallerySection[]
}) {

	const [formData, setFormData] = useState<UploadFormData>({
		title: "",
		description: "",
		sectionId: "",
		collectionId: "",
		images: [],
		imagePreviews: [],
	});

	const [isDragging, setIsDragging] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
	const [error, setError] = useState<string | null>(null);
	const [collections, setCollections] = useState<GalleryCollection[] | null>(null);

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

	const processImages = (files: FileList) => {

		const imageFiles: File[] = [];
		const previews: string[] = [];

		Array.from(files).forEach((file) => {

			if (file.type.startsWith("image/")) {

				imageFiles.push(file);
				previews.push(URL.createObjectURL(file));

			};

		});

		if (imageFiles.length === 0) {

			setError("No valid image files selected");
			setTimeout(() => setError(null), 3000);

			return;

		};

		setFormData((prev) => ({
			...prev,
			images: [...prev.images, ...imageFiles],
			imagePreviews: [...prev.imagePreviews, ...previews],
		}));

		setIsDragging(false);
		setError(null);

	};

	const handleDrop = (e: React.DragEvent) => {

		e.preventDefault();
		e.stopPropagation();

		const files = e.dataTransfer.files;

		if (files.length > 0) {
			processImages(files);
		};

	};

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

		const files = e.currentTarget.files;

		if (files && files.length > 0) {
			processImages(files);
		};

	};

	const removeImage = (index: number) => {

		setFormData((prev) => ({
			...prev,
			images: prev.images.filter((_, i) => i !== index),
			imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
		}));

	};

	const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

		const { name, value } = e.currentTarget;

		if (name === "sectionId") {

			const collectionsRes = await getCollectionsBySectionId(value);
			setCollections(collectionsRes ?? null);

			setFormData((prev) => ({
				...prev,
				collectionId: "",
				[name]: value,
			}));

			return;

		};

		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));


	};

	async function uploadImage(file: File) {

		const formData = new FormData();
		formData.append("file", file);

		const res = await fetch("/api/gallery/upload", {
			method: "POST",
			body: formData
		});

		if (!res.ok) {
			throw new Error("Failed to upload image");
		}

		const data = await res.json();
		return data.url;

	};

	async function uploadToGallery(imageUrl: string, title: string, description: string, collectionId: string) {

		const res = await fetch("/api/gallery", {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				image_url: imageUrl,
				title,
				description,
				collectionId
			})
		});

		if (!res.ok) {
			const data = await res.json();
			throw new Error(data.error || "Failed to save item to gallery");
		};

	};

	const handleSubmit = async (e: React.FormEvent) => {

		e.preventDefault();
		setError(null);

		if (formData.images.length === 0 || !formData.title || !formData.collectionId) {
			setError("Please fill in required fields and select at least one image");
			return;
		};

		setIsLoading(true);

		const progress: UploadProgress[] = formData.images.map((img) => ({
			filename: img.name,
			status: "pending"
		}));

		setUploadProgress(progress);

		for (let i = 0; i < formData.images.length; i++) {

			const file = formData.images[i];

			setUploadProgress((prev) =>
				prev.map((p, idx) => idx === i ? { ...p, status: "uploading" } : p)
			);

			try {

				const imageUrl = await uploadImage(file);

				const itemTitle = formData.images.length > 1
					? `${formData.title} - ${i + 1}`
					: formData.title;

				await uploadToGallery(imageUrl, itemTitle, formData.description, formData.collectionId);

				setUploadProgress((prev) =>
					prev.map((p, idx) => idx === i ? { ...p, status: "success" } : p)
				);

			} catch (err: any) {

				setUploadProgress((prev) =>
					prev.map((p, idx) => idx === i ? { ...p, status: "error", error: err.message } : p)
				);

			};

		};

		setIsLoading(false);

		const allSuccess = uploadProgress.every(p => p.status === "success");

		if (allSuccess) {

			setTimeout(() => {
				setFormData({
					title: "",
					description: "",
					sectionId: "",
					collectionId: "",
					images: [],
					imagePreviews: []
				});
				setUploadProgress([]);
			}, 2000);

		};

	};

	return (
		<div className="flex-col w-full flex items-center justify-center">

			<div className="w-full max-w-2xl">

				<form onSubmit={handleSubmit} className="space-y-8">

					<div
						onDragEnter={handleDragEnter}
						onDragLeave={handleDragLeave}
						onDragOver={handleDragOver}
						onDrop={handleDrop}
						className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ease-out ${isDragging
							? "border-slate-400 bg-slate-100"
							: "border-slate-200"
							} ${formData.images.length > 0 ? "bg-slate-50" : "bg-white"}`}
					>

						<input
							id="image_input"
							type="file"
							accept="image/*"
							multiple
							onChange={handleFileInputChange}
							className="hidden"
						/>

						{formData.images.length > 0 ? (

							<div className="p-6">

								<div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">

									{formData.imagePreviews.map((preview, index) => (

										<div key={index} className="relative group">

											<img
												src={preview}
												alt={`Preview ${index + 1}`}
												className="w-full h-32 object-cover rounded-lg"
											/>

											<button
												type="button"
												onClick={() => removeImage(index)}
												className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
											>
												<X className="w-4 h-4" />
											</button>

										</div>

									))}

								</div>

								<button
									type="button"
									onClick={() => document.getElementById("image_input")?.click()}
									className="w-full py-2 px-4 rounded-lg border-2 border-dashed border-slate-300 text-slate-600 hover:border-slate-400 hover:text-slate-700 transition-colors text-sm font-medium"
								>
									Add more images
								</button>

							</div>

						) : (

							<div className="px-12 py-8 text-center">

								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 mb-4">
									<Cloud className="w-8 h-8 text-slate-600" />
								</div>

								<h3 className="text-lg font-medium text-slate-900 mb-2">
									Drag your images here
								</h3>

								<p className="text-sm text-slate-600 mb-4">
									or click to browse (multiple files supported)
								</p>

								<label htmlFor="image_input" className="inline-block">
									<span className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white font-medium text-sm cursor-pointer hover:bg-slate-800 transition-colors">
										Select images
									</span>
								</label>

							</div>

						)}

					</div>

					<div className="space-y-4">

						<div>

							<label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
								Title {formData.images.length > 1 && <span className="text-slate-500">(numbers will be appended)</span>}
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

							<label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
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
								name="sectionId"
								value={formData.sectionId}
								onChange={handleInputChange}
								className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all appearance-none cursor-pointer"
							>

								<option value="">Choose a section</option>
								{sections.map((section) => (
									<option
										key={section.id}
										className="capitalize"
										value={section.id}>{section.title}</option>
								))}

							</select>

						</div>

						<div>

							<label htmlFor="section" className="block text-sm font-medium text-slate-700 mb-2">
								Collection
							</label>

							<select
								id="collection"
								name="collectionId"
								value={formData.collectionId}
								onChange={handleInputChange}
								disabled={!collections}
								className="w-full px-4 py-3 rounded-lg border border-slate-200 bg-white text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all appearance-none cursor-pointer"
							>

								<option value="">Choose a collection</option>
								{collections?.map((collection) => (
									<option
										key={collection.id}
										className="capitalize"
										value={collection.id}>{collection.title}</option>
								))}

							</select>

						</div>

					</div>

					{uploadProgress.length > 0 && (

						<div className="space-y-2">

							<h4 className="text-sm font-medium text-slate-700">Upload Progress</h4>

							{uploadProgress.map((progress, index) => (

								<div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200">

									{progress.status === "pending" && (
										<div className="w-5 h-5 rounded-full border-2 border-slate-300" />
									)}

									{progress.status === "uploading" && (
										<Loader2 className="w-5 h-5 text-blue-600 animate-spin flex-shrink-0" />
									)}

									{progress.status === "success" && (
										<Check className="w-5 h-5 text-green-600 flex-shrink-0" />
									)}

									{progress.status === "error" && (
										<X className="w-5 h-5 text-red-600 flex-shrink-0" />
									)}

									<div className="flex-1 min-w-0">
										<p className="text-sm text-slate-900 truncate">{progress.filename}</p>
										{progress.error && (
											<p className="text-xs text-red-600">{progress.error}</p>
										)}
									</div>

								</div>

							))}

						</div>

					)}

					{error && (
						<div className="p-4 rounded-lg bg-red-50 border border-red-200">
							<p className="text-sm text-red-600">{error}</p>
						</div>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className="w-full py-3 px-6 rounded-lg bg-slate-900 text-white font-medium transition-all duration-200 hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
					>

						{isLoading ? (

							<>
								<Loader2 className="w-5 h-5 animate-spin" />
								Uploading {uploadProgress.filter(p => p.status === "success").length} / {formData.images.length}
							</>

						) : (

							<>
								Upload {formData.images.length > 0 && `(${formData.images.length} image${formData.images.length > 1 ? 's' : ''})`}
							</>

						)}

					</button>

				</form>

			</div>

		</div>

	);

};