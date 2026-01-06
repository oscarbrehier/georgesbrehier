"use client"

import { deleteGalleryItem } from "@/app/actions/deleteGalleryItems";
import { cn } from "@/utils/utils";
import { Ellipsis, X } from "lucide-react";
import { MouseEvent, useEffect, useState } from "react";
import { toast } from "sonner";

export function GalleryItem({
	item,
	isSelected,
	isEditMode,
	onSelect,
	onDeselect,
	onDeleted
}: {
	item: GalleryItemWithCollection;
	isSelected: boolean;
	isEditMode: boolean;
	onSelect: () => void;
	onDeselect: () => void;
	onDeleted: () => void;
}) {

	const [isDeleting, setIsDeleting] = useState(false);

	function handleSelect() {

		if (isSelected) {
			onDeselect();
		} else {
			onSelect();
		};

	};

	async function handleDeleteItem(e: MouseEvent) {

		e.stopPropagation();

		if (isDeleting) return;
		if (!confirm("Are you sure you want to delete this item?")) return;

		setIsDeleting(true);

		try {

			const { error } = await deleteGalleryItem({ id: item.id, collectionId: item.collection.id });
			if (error) {

				toast("Failed to delete item:", {
					description: error
				});

				return;

			};

			toast("Item deleted.")
			onDeleted();

		} finally {
			setIsDeleting(false);
		};

	};

	return (

		<div className="relative flex bg-neutral-200 group">

			{isEditMode && (
				<button className={cn(
					"group-hover:flex hidden size-6",
					"bg-neutral-50 outline-1 outline-red-600/20 absolute -top-2 -right-2 z-40 rounded-full items-center justify-center"
				)}
					onClick={handleDeleteItem}
					disabled={isDeleting}
				>
					<X size={16} className="text-red-600" />
				</button>
			)}

			<button
				className={cn(
					"flex items-center",
					isSelected && "ring-2 ring-offset-2 ring-blue-600"
				)}
				onClick={handleSelect}
				disabled={!isEditMode || isDeleting}
			>
				<img src={item.image_url} alt={item.title} />
			</button>
			
		</div>

	);

};