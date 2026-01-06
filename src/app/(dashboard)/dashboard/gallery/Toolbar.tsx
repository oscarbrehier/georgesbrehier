"use client"

import { deleteGalleryItems } from "@/app/actions/deleteGalleryItems";
import { cn } from "@/utils/utils";
import { Ban, Pencil, PencilOff } from "lucide-react";
import { useRouter } from "next/navigation";

export function Toolbar({
	isEditing,
	selectedItems,
	onEditToggle,
	onClearSelected
}: {
	isEditing: boolean;
	selectedItems: GalleryItemToDelete[];
	onEditToggle: () => void;
	onClearSelected: () => void;
}) {

	const router = useRouter();

	async function handleDelete() {

		try {

			const { count, error } = await deleteGalleryItems(selectedItems);
			if (error) console.log(error)
			console.log("successfully delete", count, "items");
			onClearSelected();
			router.refresh();

		} catch (err) {

			console.log(err)

		}

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
							disabled={selectedItems.length === 0}
						>
							<Ban size={18} />
							<p className="text-sm">Delete {selectedItems.length} {selectedItems.length === 1 ? "Item" : "Items"}</p>
						</button>

					</div>

				)
			}

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