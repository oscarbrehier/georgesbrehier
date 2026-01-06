"use client"

import { cn } from "@/utils/utils";
import { Ellipsis } from "lucide-react";
import { useEffect, useState } from "react";

export function GalleryItem({
	item,
	isSelected,
	isEditMode,
	onSelect,
	onDeselect
}: {
	item: GalleryItemWithCollection;
	isSelected: boolean;
	isEditMode: boolean;
	onSelect: () => void;
	onDeselect: () => void;
}) {

	function handleSelect() {

		if (isSelected) {
			onDeselect();
		} else {
			onSelect();
		};

	};

	return (

		<button
			className={cn(
				"bg-neutral-200 flex items-center relative",
				isSelected && "ring-2 ring-offset-2 ring-blue-600"
			)}
			onClick={handleSelect}
			disabled={!isEditMode}
		>
			<img src={item.image_url} alt={item.title} />
		</button>

	);

};