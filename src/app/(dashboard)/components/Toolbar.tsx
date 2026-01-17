"use client"

import { deleteGalleryItems } from "@/app/(dashboard)/actions/deleteGalleryItems";
import { cn } from "@/utils/utils";
import { Ban, CheckCheck, Eye, Pencil, PencilOff, Plus, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button, ButtonText } from "./Button";
import { CreateItemDialog } from "./CreateItemDialog";
import { deleteSection } from "../actions/sections";
import { QuickActions } from "./QuickActions";
import { getSectionId } from "@/utils/supabase/sections";

export function Toolbar({
	isEditing,
	selectedItems,
	currentPath,
	section,
	onEditToggle,
	onClearSelected,
	onSave,
	hasChanges
}: {
	isEditing: boolean;
	selectedItems: GalleryItemToDelete[];
	currentPath: string;
	section: string | null;
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

		<div className={cn(
			"h-auto pb-8 w-full flex justify-between",
			"2lg:flex-row flex-col 2lg:items-center items-end",
			"2lg:gap-0 w gap-2"
		)}>

			<QuickActions />

			<div className="flex sm:flex-row flex-col sm:items-start items-end 2lg:gap-x-4 gap-2">

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

				{section && (
					<DeleteSectionButton section={section} />
				)}

			</div>

		</div>

	);

};

function DeleteSectionButton({
	section
}: {
	section: string;
}) {

	const [isDeleting, setIsDeleting] = useState(false);

	async function handleDeleteSection() {

		if (isDeleting) return;
		if (!section) return;
		if (!confirm(`You are about to permanently delete the "${section}" section. This action cannot be undone. Are you sure you want to proceed?`)) return;

		setIsDeleting(true);

		const sectionId = await getSectionId(section);
		if (!sectionId) {
			setIsDeleting(false);
			return null;
		};

		const { error } = await deleteSection(sectionId);

		if (error) toast("Failed to delete section:", { description: error });

		setIsDeleting(false);

	};

	return (

		<Button
			className={cn(
				"bg-red-600 hover:bg-red-700 text-neutral-50 disabled:bg-red-200"
			)}
			onClick={handleDeleteSection}
			disabled={isDeleting}
			Icon={Trash}
		>
			<ButtonText>
				Delete
				{" "}
				<span className="underline">{section.length > 20 ? `${section.slice(0, 20)}…` : section}</span>
				{" "}
				collection
			</ButtonText>
		</Button>

	);

};