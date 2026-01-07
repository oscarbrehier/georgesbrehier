"use client";

import { Selector } from "./Selector";
import { cn } from "@/utils/utils";
import { roboto } from "@/utils/fonts";
import { GalleryItem } from "./GalleryItem";
import { useEffect, useState } from "react";
import { Toolbar } from "./Toolbar";
import { usePathname, useRouter } from "next/navigation";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, useSortable, rectSortingStrategy, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { updateGalleryItems } from "@/app/actions/updateGalleryItems";

export function SortableItem({
	id,
	disabled,
	children,
}: {
	id: string;
	disabled: boolean;
	children: (args: {
		setNodeRef: (el: HTMLElement | null) => void;
		attributes: any;
		listeners: any;
		style: React.CSSProperties;
	}) => React.ReactNode;
}) {

	const {
		setNodeRef,
		attributes,
		listeners,
		transform,
		transition,
	} = useSortable({ id, disabled });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return children({
		setNodeRef,
		attributes,
		listeners,
		style,
	});

};

export function GalleryUI({
	section,
	sections,
	collections,
	groupedGalleryItems,
}: {
	section: string;
	sections: any[];
	collections: GalleryCollection[];
	groupedGalleryItems: Record<string, GalleryItemWithCollection[]>;
}) {

	const router = useRouter();
	const pathname = usePathname();
	const currentPath = `${pathname}?section=${section}`;

	const [orderedItems, setOrderedItems] = useState(groupedGalleryItems);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedItems, setSelectedItems] = useState<GalleryItemToDelete[]>([]);
	const [hasChanges, setHasChanges] = useState(false);

	useEffect(() => {
		setOrderedItems(groupedGalleryItems);
	}, [groupedGalleryItems]);

	useEffect(() => {
		if (!isEditing) setSelectedItems([]);
	}, [isEditing]);

	function checkForChanges() {

		for (const slug in orderedItems) {

			const originalItems = groupedGalleryItems[slug] || [];
			const currentItems = orderedItems[slug] || [];

			for (let i = 0; i < currentItems.length; i++) {

				if (!originalItems[i] || originalItems[i].id !== currentItems[i].id) {
					return true;
				};

			};

		};

		return false;

	};

	useEffect(() => {
		setHasChanges(checkForChanges());
	}, [orderedItems]);

	async function handleSaveChanges() {

		const changes: { id: number; collectionId: string; data: any }[] = [];

		for (const slug in orderedItems) {

			const originalItems = groupedGalleryItems[slug] || [];
			const currentItems = orderedItems[slug] || [];

			for (let index = 0; index < currentItems.length; index++) {

				const item = currentItems[index];
				const originalItem = originalItems.find(i => i.id === item.id);
				const newPosition = index + 1;

				if (!originalItem || originalItem.position !== newPosition) {
					changes.push({ id: item.id, collectionId: item.collection.id, data: { position: newPosition } });
				}

			}

		}

		await updateGalleryItems(changes);

	};


	return (
		<div className="flex h-full flex-col">

			<Toolbar
				isEditing={isEditing}
				selectedItems={selectedItems}
				currentPath={currentPath}
				onEditToggle={() => setIsEditing((v) => !v)}
				onClearSelected={() => setSelectedItems([])}
				onSave={handleSaveChanges}
				hasChanges={hasChanges}
			/>

			<div className="flex h-full">

				<Selector
					sections={sections}
					current={section}
					collections={collections}
				/>

				<div className="flex-1 overflow-y-scroll px-4">

					{collections.map((collection, idx) => {

						const items = orderedItems[collection.slug]?.sort((a, b) => a.position - b.position);
						if (!items) return null;

						return (

							<section
								key={collection.slug}
								className={cn("space-y-4", idx !== 0 && "mt-10")}
							>

								<h2
									className={cn(
										"sticky top-0 z-20 bg-neutral-100 py-2 text-5xl",
										roboto.className
									)}
								>
									{collection.title}
								</h2>

								<DndContext
									collisionDetection={closestCenter}
									onDragEnd={({ active, over }) => {

										if (!over || active.id === over.id) return;

										setOrderedItems((prev) => {

											const list = [...prev[collection.slug]];
											const oldIndex = list.findIndex((i) => String(i.id) === active.id);
											const newIndex = list.findIndex((i) => String(i.id) === over.id);

											const newList = arrayMove(list, oldIndex, newIndex);
											const updatedList = newList.map((item, index) => ({
												...item,
												position: index + 1
											}))

											return {
												...prev,
												[collection.slug]: updatedList
											};

										});

									}}
								>
									<SortableContext
										items={items.map((i) => String(i.id))}
										strategy={rectSortingStrategy}
									>

										<div className="grid grid-cols-6 gap-4">

											{items.map((item) => (

												<SortableItem
													key={item.id}
													id={String(item.id)}
													disabled={!isEditing}
												>

													{({
														setNodeRef,
														attributes,
														listeners,
														style,
													}) => (

														<div ref={setNodeRef} style={style}>

															<GalleryItem
																item={item}
																isEditMode={isEditing}
																currentPath={currentPath}
																isSelected={selectedItems.some(
																	(i) => i.id === item.id
																)}
																onSelect={() =>
																	setSelectedItems((prev) => [
																		...prev,
																		{
																			id: item.id,
																			collectionId: item.collection.id,
																		},
																	])
																}
																onDeselect={() =>
																	setSelectedItems((prev) =>
																		prev.filter((i) => i.id !== item.id)
																	)
																}
																onDeleted={() => router.refresh()}
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

							</section>

						);
					})}

				</div>

			</div>

		</div>

	);

};