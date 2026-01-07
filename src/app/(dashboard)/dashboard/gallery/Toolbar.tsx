"use client"

import { deleteGalleryItems } from "@/app/(dashboard)/actions/deleteGalleryItems";
import { cn } from "@/utils/utils";
import { Ban, CheckCheck, Pencil, PencilOff, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button, ButtonText } from "../../components/Button";
import { CreateItemDialog } from "../../components/CreateItemDialog";

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

		<div className="h-20 w-full flex items-start justify-between gap-4">

			<div className="flex gap-4">

				<CreateItemDialog
					type="section"
				>
					<Button
						className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800"
						Icon={Plus}
						size="sm"
					>
						<ButtonText>
							Create new Section
						</ButtonText>
					</Button>
				</CreateItemDialog>

				<CreateItemDialog
					type="collection"
				>
					<Button
						className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800"
						Icon={Plus}
						size="sm"
					>
						<ButtonText>
							Create new Collection
						</ButtonText>
					</Button>
				</CreateItemDialog>

			</div>

			<div className="flex gap-4">

				{
					isEditing && selectedItems.length > 0 && (

						<div className="flex items-center space-x-2">

							<Button
								className={"bg-red-600 hover:bg-red-700 text-neutral-50"}
								onClick={handleDelete}
								disabled={selectedItems.length === 0 || isDeleting}
								Icon={Ban}
							>
								<ButtonText>Delete {selectedItems.length} {selectedItems.length === 1 ? "Item" : "Items"}</ButtonText>
							</Button>

						</div>

					)
				}

				{hasChanges && (
					<div className="flex items-center space-x-2">

						<Button
							className="bg-amber-600 hover:bg-amber-700 text-neutral-50"
							onClick={onSave}
							disabled={isDeleting}
							Icon={CheckCheck}
						>
							<ButtonText>Save changes</ButtonText>
						</Button>

					</div>
				)}


				<Button
					className={cn(
						isEditing ? "bg-blue-600 hover:bg-blue-700 text-neutral-50" : "bg-neutral-200 hover:bg-neutral-300 text-neutral-800"
					)}
					onClick={() => onEditToggle()}
					Icon={isEditing ? PencilOff : Pencil}
				>
					<ButtonText>{isEditing ? "Exit Edit Mode" : "Edit"}</ButtonText>
				</Button>

			</div>

		</div>

	);

};