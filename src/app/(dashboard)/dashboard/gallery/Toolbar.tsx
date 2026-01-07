"use client"

import { deleteGalleryItems } from "@/app/actions/deleteGalleryItems";
import { cn } from "@/utils/utils";
import { Ban, CheckCheck, Pencil, PencilOff } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export function Toolbar({
	isEditing,
	selectedItems,
	currentPath,
	onEditToggle,
	onClearSelected,
	onSave,
	hasChanges
}: {
	isEditing: boolean;
	selectedItems: GalleryItemToDelete[];
	currentPath: string;
	onEditToggle: () => void;
	onClearSelected: () => void;
	onSave: () => void;
	hasChanges: boolean;
}) {

	const router = useRouter();
	const pathname = usePathname();

	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDelete() {

		if (isDeleting) return;
		setIsDeleting(true);

		try {

			const { count, error } = await deleteGalleryItems(selectedItems, currentPath);

			if (error) {

				toast("Failed to delete item:", {
					description: error
				});

				return;

			}

			toast(`Sucessfully deleted ${count} ${count > 1 ? "items" : "item"}`);

			onClearSelected();
			router.refresh();

		} finally {
			setIsDeleting(false);
		};

	};

	return (

		<div className="h-20 w-full flex items-center justify-end gap-4">

			{
				isEditing && selectedItems.length > 0 && (

					<div className="flex items-center space-x-2">

						<button className={cn(
							"py-2 px-4 rounded-xl flex items-center gap-2 cursor-pointer",
							"bg-red-600 hover:bg-red-700 text-neutral-50"
						)}
							onClick={handleDelete}
							disabled={selectedItems.length === 0 || isDeleting}
						>
							<Ban size={18} />
							<p className="text-sm">Delete {selectedItems.length} {selectedItems.length === 1 ? "Item" : "Items"}</p>
						</button>

					</div>

				)
			}

			{hasChanges && (
				<div className="flex items-center space-x-2">

					<button className={cn(
						"py-2 px-4 rounded-xl flex items-center gap-2 cursor-pointer",
						"bg-amber-600 hover:bg-amber-700 text-neutral-50"
					)}
						onClick={onSave}
						disabled={isDeleting}
					>
						<CheckCheck size={18} />
						<p className="text-sm">Save changes</p>
					</button>

				</div>
			)}


			<button className={cn(
				"py-2 px-4 rounded-xl flex items-center gap-2 cursor-pointer",
				isEditing ? "bg-blue-600 hover:bg-blue-700 text-neutral-50" : "bg-neutral-400 hover:bg-neutral-500 text-neutral-800"
			)}
				onClick={() => onEditToggle()}
			>
				{isEditing ? <PencilOff size={18} /> : <Pencil size={18} />}
				<p className="text-sm">{isEditing ? "Exit Edit Mode" : "Edit"}</p>
			</button>

		</div>

	);

};