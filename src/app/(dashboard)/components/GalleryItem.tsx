"use client"

import { deleteGalleryItem } from "@/app/(dashboard)/actions/deleteGalleryItems";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/utils/utils";
import { Grip, Pen, X } from "lucide-react";
import Image from "next/image";
import { MouseEvent, useState } from "react";
import { toast } from "sonner";
import { GalleryItemForm } from "./dialog/GalleryItemForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function GalleryItem({
	item,
	isSelected,
	isEditMode,
	currentPath,
	onSelect,
	onDeselect,
	onDeleted,
	dragAttributes,
	dragListeners,
}: {
	item: GalleryItem & { collection: { id: string; title: string; is_visible: boolean; }, parent_hidden: boolean };
	isSelected: boolean;
	isEditMode: boolean;
	currentPath: string;
	onSelect: () => void;
	onDeselect: () => void;
	onDeleted: () => void;
	dragAttributes?: any;
	dragListeners?: any;
}) {

	const [isDeleting, setIsDeleting] = useState(false);

	const isVisible = !item.parent_hidden && item.collection.is_visible;
	const isHidden = !isVisible;

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

			const { error } = await deleteGalleryItem({ id: item.id, collectionId: item.collection.id }, currentPath);
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

		<div
			id={item.collection.title}
			className={cn(isHidden && "opacity-30")}
		>

			<div
				className={cn(
					"relative h-full w-full flex bg-neutral-200 group",
				)}
			>

				{isEditMode && (
					<button
						{...dragAttributes}
						{...dragListeners}
						className={cn(
							"group-hover:flex hidden size-6",
							"bg-neutral-50 outline-1 outline-red-600/20 absolute -top-2 right-6 w z-40 rounded-full items-center justify-center"
						)}
						onClick={(e) => e.stopPropagation()}
					>
						<Grip size={16} className="text-red-600" />
					</button>
				)}

				{isEditMode && (

					<Dialog>

						<DialogTrigger asChild>
							<button
								className={cn(
									"group-hover:flex hidden size-6",
									"bg-neutral-50 outline-1 outline-red-600/20 absolute -top-2 right-14 z-40 rounded-full items-center justify-center"
								)}
							>
								<Pen size={16} className="text-red-600" />
							</button>
						</DialogTrigger>

						<DialogContent className="w-fit bg-dashboard">

							<DialogHeader>
								<DialogTitle>Edit item</DialogTitle>
							</DialogHeader>

							<GalleryItemForm
								data={{
									...item,
									collectionId: item.collection.id
								}}
							/>

						</DialogContent>

					</Dialog>

				)}

				{isEditMode && (
					<button
						className={cn(
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
						"flex flex-col justify-center w-full h-80",
						isSelected && "ring-2 ring-offset-2 ring-blue-600"
					)}
					onClick={() => {
						if (!isEditMode || isDeleting) return;
						handleSelect();
					}}
					aria-disabled={!isEditMode || isDeleting}
				>

					<div className="relative w-full h-full">
						<Image
							src={item.image_url}
							alt="image"
							fill
							className="object-contain"
							quality={50}
						/>
					</div>

				</button>

			</div>

			<div className="mt-1">
				<p className="text-sm truncate">{item.title}</p>
			</div>

		</div>

	);

};