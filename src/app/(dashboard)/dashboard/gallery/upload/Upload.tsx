"use client"

import type React from "react";
import { useState } from "react";
import { Cloud, Loader2, Check, X, Image as ImageIcon, Plus } from "lucide-react";
import { getCollectionsBySectionId } from "@/utils/supabase/collections";
import { useUploadFormStore } from "@/stores/useUploadForm";
import { cn } from "@/utils/utils";
import { Select } from "@/components/dashboard/Select";
import { Input } from "@/components/dashboard/Input";
import { CreateItemDialog } from "@/app/(dashboard)/components/CreateItemDialog";
import { getSections } from "@/utils/supabase/sections";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { uploadImage } from "@/app/(dashboard)/actions/uploadImage";

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
};

export function Upload({
	sections: initialSections
}: {
	sections: GallerySection[]
}) {

	const { formData, setFormData, resetForm } = useUploadFormStore();

	const [sections, setSections] = useState<GallerySection[]>(initialSections);
	const [collections, setCollections] = useState<GalleryCollection[] | null>(null);

	const [isLoading, setIsLoading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
	const [error, setError] = useState<string | null>(null);

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

		setFormData({
			images: [...formData.images, ...imageFiles],
			imagePreviews: [...formData.imagePreviews, ...previews],
		});

		drag.resetDrag();
		setError(null);

	};

	const drag = useDragAndDrop(processImages);

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

		const files = e.currentTarget.files;

		if (files && files.length > 0) {
			processImages(files);
		};

	};

	const removeImage = (index: number) => {

		setFormData({
			images: formData.images.filter((_, i) => i !== index),
			imagePreviews: formData.imagePreviews.filter((_, i) => i !== index),
		});

	};

	const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {

		const { name, value } = e.currentTarget;

		if (name === "sectionId") {

			const collectionsRes = await getCollectionsBySectionId(value);
			setCollections(collectionsRes ?? null);

			setFormData({
				collectionId: "",
				sectionId: value,
			});

			return;

		};

		setFormData({
			[name]: value,
		});


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

				const { url, error } = await uploadImage(file);

				if (error || !url) {
					setError(error || "Upload failed");
					setIsLoading(false);
					return;
				};

				const itemTitle = formData.images.length > 1
					? `${formData.title} - ${i + 1}`
					: formData.title;

				await uploadToGallery(url, itemTitle, formData.description, formData.collectionId);

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
				resetForm();
				setUploadProgress([]);
			}, 2000);

		};

	};

	const [openSectionDialog, setOpenSectionDialog] = useState(false);
	const [openCollectionDialog, setOpenCollectionDialog] = useState(false);

	return (
		<div className="flex-1 flex-col w-full flex items-center justify-center pt-10 pb-8">

			<div className={cn(
				"w-full space-y-3 transition-all duration-300 ease-in-out text-center mb-14"
			)}>

				<p className="text-5xl text-black">Upload to gallery</p>
				<p className="text-neutral-500">Upload single or multiple items to the gallery</p>

			</div>

			<CreateItemDialog
				type="section"
				onSuccess={async () => {
					const sectionsRes = await getSections();
					setSections(sectionsRes);
				}}
				open={openSectionDialog}
				onOpenChange={setOpenSectionDialog}
			></CreateItemDialog>

			<CreateItemDialog
				type="collection"
				onSuccess={async () => {
					if (formData.sectionId) {
						const collectionRes = await getCollectionsBySectionId(formData.sectionId);
						setCollections(collectionRes);
					}
				}}
				open={openCollectionDialog}
				onOpenChange={setOpenCollectionDialog}
			></CreateItemDialog>

			<div className="w-full max-w-4xl">

				<form onSubmit={handleSubmit} className="space-y-8">

					<div
						onDragEnter={drag.handleDragEnter}
						onDragLeave={drag.handleDragLeave}
						onDragOver={drag.handleDragOver}
						onDrop={drag.handleDrop}
						className={`relative rounded-2xl border-2 border-dashed transition-all duration-300 ease-out ${drag.isDragging
							? "border-neutral-400 bg-background"
							: "border-neutral-200"
							}`}
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
									className="w-full py-2 px-4 rounded-lg border-2 border-dashed border-neutral-300 text-neutral-600 hover:border-neutral-400 hover:text-neutral-700 transition-colors text-sm font-medium"
								>
									Add more images
								</button>

							</div>

						) : (

							<div className="px-12 py-8 text-center">

								<div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-background mb-4">
									<Cloud className="w-8 h-8 text-neutral-600" />
								</div>

								<h3 className="text-lg font-medium text-neutral-900 mb-2">
									Drag your images here
								</h3>

								<p className="text-sm text-neutral-600 mb-4">
									or click to browse (multiple files supported)
								</p>

								<label htmlFor="image_input" className="inline-block">
									<span className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-neutral-900 text-white font-medium text-sm cursor-pointer hover:bg-neutral-800 transition-colors">
										Select images
									</span>
								</label>

							</div>

						)}

					</div>

					<div className="space-y-4">

						<Input
							label={<>Title {formData.images.length > 1 && <span className="text-neutral-500">(numbers will be appended)</span>}</>}
							id="title"
							type="text"
							name="title"
							value={formData.title}
							onChange={handleInputChange}
						/>

						<div>

							<label htmlFor="description" className="block text-sm font-medium text-neutral-700 mb-2">
								Description
							</label>

							<textarea
								id="description"
								name="description"
								value={formData.description}
								onChange={handleInputChange}
								rows={2}
								className="w-full px-4 py-3 rounded-lg border border-neutral-200 bg-background text-neutral-900 placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all resize-none"
							/>

						</div>

						<div>

							<Select
								label="Section"
								id="section"
								name="sectionId"
								value={formData.sectionId}
								onChange={handleInputChange}
							>
								<option value="">Choose a section</option>
								{sections.map((section) => (
									<option
										key={section.id}
										className="capitalize"
										value={section.id}>{section.title}</option>
								))}
							</Select>

							<button
								type="button"
								className="text-neutral-600 text-xs mt-1.5 underline cursor-pointer"
								onClick={() => setOpenSectionDialog(true)}
							>
								Create a new section
							</button>

						</div>

						<div>

							<Select
								label="Collection"
								id="collection"
								name="collectionId"
								value={formData.collectionId}
								onChange={handleInputChange}
								disabled={!collections}
							>
								<option value="">Choose a collection</option>
								{collections?.map((collection) => (
									<option
										key={collection.id}
										className="capitalize"
										value={collection.id}>{collection.title}</option>
								))}
							</Select>

							<button
								type="button"
								className="text-neutral-600 text-xs mt-1.5 underline cursor-pointer"
								onClick={() => setOpenCollectionDialog(true)}
							>
								Create a new collection
							</button>

						</div>

					</div>

					{uploadProgress.length > 0 && (

						<div className="space-y-2">

							<h4 className="text-sm font-medium text-neutral-700">Upload Progress</h4>

							{uploadProgress.map((progress, index) => (

								<div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-background border border-neutral-200">

									{progress.status === "pending" && (
										<div className="w-5 h-5 rounded-full border-2 border-neutral-300" />
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
										<p className="text-sm text-neutral-900 truncate">{progress.filename}</p>
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
						className="w-full py-3 px-6 rounded-lg bg-neutral-900 text-white font-medium transition-all duration-200 hover:bg-neutral-800 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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