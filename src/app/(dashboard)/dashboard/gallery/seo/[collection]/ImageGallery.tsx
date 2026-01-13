"use client"

import { uploadImage } from "@/app/(dashboard)/actions/uploadImage";
import { cn } from "@/utils/utils";
import { Loader2, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type GalleryItemSubset = Pick<GalleryItem, "id" | "image_url" | "title">;

export function ImageGallery({
	images,
	onSelect
}: {
	images: GalleryItemSubset[];
	onSelect: (item: GalleryItemSubset) => void;
}) {

	const [galleryImages, setGalleryImages] = useState<GalleryItemSubset[]>(images);
	const [selected, setSelected] = useState<GalleryItemSubset | null>(null);
	const [isImageUploading, setIsImageUploading] = useState(false);

	function handleSelect(item: GalleryItemSubset) {

		onSelect(item);
		setSelected(item);

	};

	async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {

		const file = e.target.files?.[0];
		if (!file) return;

		setIsImageUploading(true);

		try {

			const { url, error } = await uploadImage(file);

			if (!error || !url) {
				toast("Image upload failed", { description: error });
				return;
			};

			const newItem: GalleryItemSubset = {
				id: Math.random(),
				image_url: url,
				title: file.name,
			};

			setGalleryImages(prev => [...prev, newItem]);

		} finally {

			setIsImageUploading(false);

		};

	};

	return (

		<div className="w-full space-y-8">

			<div className="w-full flex items-center justify-between">

				<p className="text-black text-3xl">Image Gallery</p>

			</div>

			<div className="grid grid-cols-5 gap-2 auto-rows-auto">

				{
					galleryImages.map((item, idx) => (

						<button
							key={`${item.title}-${idx}`}
							onClick={() => handleSelect(item)}
							className={cn(
								"transition-all cursor-pointer rounded-md overflow-hidden",
								selected && selected.id !== item.id ? "opacity-40" : "opacity-100"
							)}
						>

							<img
								src={item.image_url}
								alt={item.title}
							/>

						</button>

					))
				}

				<div className="h-full w-full">

					<input
						id="image_upload"
						type="file"
						accept="image/*"
						className="hidden"
						disabled={isImageUploading}
						onChange={handleImageUpload}
					/>

					<label
						htmlFor="image_upload"
						className={cn(
							"h-full w-full bg-neutral-200 rounded-md flex items-center justify-center",
							isImageUploading ? "cursor-default" : "cursor-pointer"
						)}>
						{
							isImageUploading ? (

								<Loader2 className="size-8 text-blue-600 animate-spin flex-shrink-0" />

							) : (

								<Plus className="text-neutral-600" />

							)
						}
					</label>

				</div>

			</div>

		</div>


	);

};