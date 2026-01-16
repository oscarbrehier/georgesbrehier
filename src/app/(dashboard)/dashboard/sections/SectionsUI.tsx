"use client"

import { MouseEvent, useEffect, useState } from "react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { SortableItem } from "../gallery/GalleryUI";
import { SectionItem } from "./SectionItem";
import { Button, ButtonText } from "../../components/Button";
import { CheckCheck } from "lucide-react";
import { updateSectionPositions } from "../../actions/sections";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SectionsUI({
	sections
}: {
	sections: GallerySection[];
}) {

	const [orderedItems, setOrderedItems] = useState(sections);
	const [isMounted, setIsMounted] = useState(false);

	const hasChanges = JSON.stringify(sections.map((s => s.id))) !== JSON.stringify(orderedItems.map((s => s.id)));

	useEffect(() => {
		setIsMounted(true);
	}, []);

	useEffect(() => {
		setOrderedItems(sections);
	}, [sections]);

	if (!isMounted) return null;

	async function saveChanges(e: MouseEvent<HTMLButtonElement>) {

		e.preventDefault();

		const changes: { id: string; position: number }[] = orderedItems.map((item, index) => ({
			id: item.id,
			position: index + 1
		}));

		const { error } = await updateSectionPositions(changes);
		if (error) toast("Update failed", { description: error });

	};

	return (

		<div className="h-full flex flex-col px-8 pb-8">

			<div className="mb-10 flex items-center justify-between">

				<div className="flex items-center justify-between">
					<h1 className="text-4xl">Sections</h1>
				</div>

				<div>

					{hasChanges && (
						<Button
							className="bg-amber-600 hover:bg-amber-700 text-neutral-50"
							onClick={saveChanges}
							Icon={CheckCheck}
						>
							<ButtonText>Save positions</ButtonText>
						</Button>
					)}

				</div>

			</div>

			<DndContext
				collisionDetection={closestCenter}
				onDragEnd={({ active, over }) => {

					if (!over || active.id === over.id) return;

					setOrderedItems((items) => {

						const oldIndex = items.findIndex((i) => i.id === active.id);
						const newIndex = items.findIndex((i) => i.id === over.id);

						const newList = arrayMove(items, oldIndex, newIndex);
						const updatedList = newList.map((item, index) => ({
							...item,
							position: index + 1
						}))

						return updatedList;

					});

				}}
			>

				<SortableContext
					items={orderedItems.map(s => s.id)}
					strategy={rectSortingStrategy}
				>
					<div className="flex-1 w-full overflow-y-scroll grid 2xl:grid-cols-2 gap-4 items-start content-start auto-rows-max">

						{orderedItems.map((section) => (

							<SortableItem
								key={section.id}
								id={section.id}
								disabled={false}
							>
								{({
									setNodeRef,
									attributes,
									listeners,
									style
								}) => (

									<div
										ref={setNodeRef}
										style={style}
									>

										<SectionItem
											section={section}
											dragAttributes={attributes}
											dragListeners={listeners}
										/>

									</div>

								)}
							</SortableItem>

						))}

					</div>
				</SortableContext>

			</DndContext>

		</div>

	);

};