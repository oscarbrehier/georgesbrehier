"use client"

import { closestCenter, DndContext } from "@dnd-kit/core";
import { Toolbar } from "../../gallery/Toolbar";
import { arrayMove, rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { SortableItem } from "../../gallery/GalleryUI";
import { GalleryItem } from "../../gallery/GalleryItem";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { roboto } from "@/utils/fonts";
import { CollectionVisibilityBtn } from "../../gallery/CollectionVisibilityBtn";
import { updateGalleryItems } from "@/app/(dashboard)/actions/updateGalleryItems";

export function CollectionsUI({
	section,
	collections,
	groupedGalleryItems
}: {
	section: string;
	collections: GalleryCollection[];
	groupedGalleryItems: Record<string, GalleryItemWithCollection[]> | null;
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

		if ((!orderedItems || Object.keys(orderedItems).length === 0) && groupedGalleryItems) {
			return true;
		};

		if (!groupedGalleryItems || !orderedItems) return false;

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

		if (!orderedItems || !groupedGalleryItems) return;

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

		<div className="h-[calc(100vh-8rem)] flex flex-col px-8 pb-8">

			<div className="flex items-center justify-between mb-10">
				<h1 className="text-4xl">{section}</h1>
			</div>

			<Toolbar
				isEditing={isEditing}
				selectedItems={selectedItems}
				currentPath={currentPath}
				section={section === "all" ? null : section}
				onEditToggle={() => setIsEditing((v) => !v)}
				onClearSelected={() => setSelectedItems([])}
				onSave={handleSaveChanges}
				hasChanges={hasChanges}
			/>

			<div className="flex h-full overflow-y-scroll">

				{orderedItems ? (

					<div className="flex-1">

						{collections.map((collection, idx) => {

							const items = orderedItems[collection.slug]?.sort((a, b) => a.position - b.position);
							if (!items) return null;

							return (

								<section
									key={collection.id}
									className={cn("space-y-4", idx !== 0 && "mt-10")}
								>

									<div className="sticky top-0 z-20 bg-dashboard py-2 flex items-center space-x-4">

										<h2
											className={cn(
												"text-3xl",
												roboto.className
											)}
										>
											{collection.title}
										</h2>

										<CollectionVisibilityBtn
											collection={collection}
										/>

									</div>

									<DndContext
										collisionDetection={closestCenter}
										onDragEnd={({ active, over }) => {

											if (!over || active.id === over.id) return;

											setOrderedItems((prev) => {

												if (!prev || !prev[collection.slug]) return prev;

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

											<div className={cn(
												"grid gap-4",
												"2xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2"
											)}>

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

				) : (

					<div className="h-full w-full flex items-center justify-center">
						<p className="text-muted-foreground">This section is empty.</p>
					</div>

				)}

			</div>

		</div>

	);

};