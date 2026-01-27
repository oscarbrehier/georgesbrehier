"use client"

import type React from "react";
import { useEffect, useState } from "react";
import { Upload, Trash2, Loader2, X } from "lucide-react";
import { ArtworkMetadata, useUploadFormStore } from "@/stores/useUploadForm";
import { useDragAndDrop } from "@/hooks/useDragAndDrop";
import { uploadImage } from "@/app/(dashboard)/actions/uploadImage";
import { uploadToGalleryBatch } from "@/app/(dashboard)/actions/uploadToGallery";
import { MAX_BODY_SIZE, UI_LABELS } from "@/utils/constants";
import { useRouter } from "next/navigation";
import { FileSelector } from "./FileSelector";
import { Button } from "@/components/ui/button";
import { ImageCard } from "./ImageCard";
import { getCollectionsBySection } from "@/utils/supabase/collections";
import { UploadDestionation } from "./UploadDestination";
import { toast } from "sonner";

export interface UploadProgress {
	filename: string
	status: "pending" | "uploading" | "success" | "error"
	error?: string
};

export interface ImageFile extends File {
	id: string;
	preview: string;
};

export function UploadV2({
	sections: initialSections,
	target,
}: {
	sections: GallerySection[];
	target?: { sectionId: string | null, collectionId: string | null, collections: GalleryCollection[] | null };
}) {

	const router = useRouter();

	const { formData, setGlobalData, addItems, updateItem, removeItem, resetForm } = useUploadFormStore();

	const [sections, setSections] = useState<GallerySection[]>(initialSections);
	const [collections, setCollections] = useState<GalleryCollection[] | null>(target?.collections ?? null);

	const [isLoading, setIsLoading] = useState(false);
	const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgress>>({});
	const [error, setError] = useState<string | null>(null);
	const [fileError, setFileError] = useState<string | null>(null);

	useEffect(() => {

		if (target?.sectionId) {

			setGlobalData({
				sectionId: target?.sectionId ?? "",
				collectionId: target?.collectionId ?? ""
			});

		} else {

			setGlobalData({
				sectionId: "",
				collectionId: ""
			});

		};

		if (target?.collections) {
			setCollections(target.collections);
		} else if (!target?.sectionId) {
			setCollections(null);
		};

	}, [target, setGlobalData]);

	useEffect(() => {

		if (!formData.sectionId) return;

		(async () => {

			const res = await getCollectionsBySection(formData.sectionId);
			setCollections(res);

		})();

	}, [formData.sectionId]);

	const toMB = (bytes: number) => (bytes / (1024 * 1024)).toFixed(1);

	const processImages = (files: FileList) => {

		setFileError(null);

		const items: ArtworkMetadata[] = [];
		const rejectedFiles: string[] = [];

		Array.from(files).forEach((file) => {

			if (!file.type.startsWith("image/")) return;

			if (file.size > MAX_BODY_SIZE) {
				rejectedFiles.push(`${file.name} (${toMB(file.size)}MB)`);
				return;
			};

			const id = crypto.randomUUID();

			items.push({
				id,
				file,
				preview: URL.createObjectURL(file),
				title: file.name,
				description: ""
			});

		});

		if (rejectedFiles.length > 0) {
			setFileError(`Skipped ${rejectedFiles.length} file(s) over ${toMB(MAX_BODY_SIZE)}MB: ${rejectedFiles.join(", ")}`);
			setTimeout(() => setFileError(null), 5000);
			if (items.length === 0) return;
		};

		if (items.length === 0 && rejectedFiles.length === 0) {
			toast("No valid image files selected");
			return;
		}

		addItems(items);

		drag.resetDrag();
		if (items.length > 0 && rejectedFiles.length === 0) {
			setError(null);
		}

	};

	const drag = useDragAndDrop(processImages);

	const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {

		const files = e.currentTarget.files;

		if (files && files.length > 0) {
			processImages(files);
		};

	};

	const handleSubmit = async (e: React.FormEvent) => {

		e.preventDefault();
		setError(null);

		if (formData.items.length === 0 || !formData.sectionId || !formData.collectionId) {

			toast.error("Missing required fields. Please select a destination and add images.");
			return;

		};

		const hasEmptyTitles = formData.items.some(i => !i.title.trim());

		if (hasEmptyTitles) {

			setError("All items must have a title.");
			toast.error("One or more images are missing a title");
			return;

		};

		setIsLoading(true);

		const initalProgress: Record<string, UploadProgress> = {};
		formData.items.forEach(item => initalProgress[item.id] = { filename: item.title, status: "pending" });

		setUploadProgress(initalProgress);

		const uploadItems: any[] = [];
		let hasError = false;

		for (const galleryItem of formData.items) {

			const itemId = galleryItem.id;

			setUploadProgress(prev => ({
				...prev,
				[itemId]: { ...prev[itemId], status: "uploading" }
			}));

			const { data: cloudData, error: imageError } = await uploadImage(galleryItem.file);

			if (imageError || !cloudData?.url) {

				setUploadProgress(prev => ({
					...prev,
					[itemId]: { ...prev[itemId], status: "error", error: imageError || "Storage failed" }
				}));

				hasError = true;
				continue;

			};

			uploadItems.push({
				title: galleryItem.title.trim(),
				description: galleryItem.description,
				collection_id: formData.collectionId,
				width: galleryItem.width ? Number(galleryItem.width) : null,
				height: galleryItem.height ? Number(galleryItem.height) : null,
				image_url: cloudData.url,
				image_width: cloudData.image_width,
				image_height: cloudData.image_height,
				cloudinary_public_id: cloudData.cloudinary_public_id,
			});

			setUploadProgress(prev => ({ ...prev, [galleryItem.id]: { ...prev[galleryItem.id], status: "uploading" } }));

		};

		if (uploadItems.length > 0) {

			const { error: batchError } = await uploadToGalleryBatch(uploadItems);

			if (batchError) {

				hasError = true;

				setUploadProgress(prev => {
					const next = { ...prev };
					formData.items.forEach(item => {
						if (next[item.id].status === "uploading") {
							next[item.id].status = "error";
							next[item.id].error = "Database save failed";
						}
					});
					return next;
				});

				toast.error("Images saved to storage, but database entry failed.");
				 
			} else {

				setUploadProgress(prev => {

					const next = { ...prev };

					formData.items.forEach(item => {
						if (next[item.id].status !== "error") next[item.id].status = "success";
					});

					return next;

				})

			};

		};

		setIsLoading(false);

		if (!hasError && uploadItems.length === formData.items.length) {

			toast.success("All items uploaded successfully");
			setTimeout(() => { resetForm(); setUploadProgress({}); }, 2000);

		} else if (hasError) {
			toast.error("Some items failed to upload. Please check errors.");
		};

	};

	const uploadCount = Object.values(uploadProgress).filter(p => p.status === "success").length;

	return (

		<div className="h-auto w-full pb-8">

			<div className="w-full h-10 flex items-center justify-between fixed pr-16 bg-dashboard z-30">

				<div>
					<p className="text-xl text-black">Upload to gallery</p>
				</div>

				{formData.items.length > 0 && (

					<div className="flex items-center space-x-4">

						{isLoading && (
							<p className="text-sm text-muted-foreground">Images uploaded: {uploadCount}/{formData.items.length}</p>
						)}

						{!isLoading && (
							<Button
								variant="ghost"
								size="sm"
								className="text-muted-foreground hover:text-destructive"
								onClick={resetForm}
								disabled={isLoading}
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Clear All
							</Button>
						)}

						<Button
							size="sm"
							onClick={handleSubmit}
							disabled={isLoading}
						>
							{isLoading ? (
								<Loader2 className="animate-spin h-4 w-4" />
							) : (
								<>
									<Upload className="mr-2 h-4 w-4" />
									Upload {formData.items.length} images
								</>
							)}
						</Button>

					</div>

				)}

			</div>

			<div className="pt-14 mb-8 space-y-4">

				<UploadDestionation
					formData={formData}
					onChange={(sectionId, collectionId) => setGlobalData({ sectionId, collectionId })}
					sections={sections}
					onSectionsChange={setSections}
					collections={collections}
					onCollectionsChange={setCollections}
				/>

				<FileSelector
					drag={drag}
					onInputChange={handleFileInputChange}
				/>

				{(fileError || error) && (
					<div className="p-4 rounded-lg bg-red-50 border border-red-200 flex justify-between">
						<p className="text-sm text-red-600">{fileError || error}</p>

						<button
							onClick={() => setFileError(null)}
							className="text-red-700 cursor-pointer"
						>
							<X size={18} />
						</button>

					</div>
				)}

			</div>

			<div className="grid grid-cols-5 gap-2">

				{formData.items.map((item, index) => (

					<ImageCard
						key={index}
						data={item}
						onRemove={removeItem}
						onUpdate={updateItem}
						progress={uploadProgress[item.id]}
						disabled={isLoading}
					/>

				))}

			</div>

		</div>

	);

};