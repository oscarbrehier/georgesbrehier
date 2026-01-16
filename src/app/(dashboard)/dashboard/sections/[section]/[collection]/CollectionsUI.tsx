"use client"

import { closestCenter, DndContext } from "@dnd-kit/core";
import { Toolbar } from "../../../gallery/Toolbar";
import { arrayMove, rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { SortableItem } from "../../../gallery/GalleryUI";
import { GalleryItem } from "../../../gallery/GalleryItem";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { roboto } from "@/utils/fonts";
import { CollectionVisibilityBtn } from "../../../gallery/CollectionVisibilityBtn";
import { updateGalleryItems } from "@/app/(dashboard)/actions/updateGalleryItems";
import { Selector } from "../../../gallery/Selector";
import { Badge } from "@/app/(dashboard)/components/Badge";

export function CollectionsUI({
	sectionTree,
}: {
	sectionTree: GallerySectionTree;
}) {

	const router = useRouter();
	const pathname = usePathname();
	const currentPath = `${pathname}?section=${sectionTree.slug}`;

	const [collections, setCollections] = useState(sectionTree.collections);
	const [isEditing, setIsEditing] = useState(false);
	const [selectedItems, setSelectedItems] = useState<GalleryItemToDelete[]>([]);
	const [hasChanges, setHasChanges] = useState(false);

	useEffect(() => {
		setCollections(sectionTree.collections);
	}, [sectionTree]);

	useEffect(() => {
		const changed = JSON.stringify(collections) !== JSON.stringify(sectionTree.collections);
		setHasChanges(changed);
	}, [collections, sectionTree.collections]);

	async function handleSaveChanges() {

		const changes: any[] = [];

		collections.forEach(collection => {
			collection.works.forEach((work, index) => {

				const newPos = index + 1;

				const originalCollection = sectionTree.collections.find(c => c.id === collection.id);
				const originalWork = originalCollection?.works.find(w => w.id === work.id);

				if (originalWork?.position !== newPos) {
					changes.push({
						id: work.id,
						collectionId: collection.id,
						data: { position: newPos }
					});
				};

			});
		});

		await updateGalleryItems(changes);
		setIsEditing(false);

	};

	return (

		<div className="h-[calc(100vh-8rem)] flex flex-col px-8 pb-8">

			<div className="flex items-center justify-between mb-10">
				<h1 className="text-4xl">{sectionTree.slug}</h1>
			</div>

			<Toolbar
				isEditing={isEditing}
				selectedItems={selectedItems}
				currentPath={currentPath}
				section={sectionTree.slug}
				onEditToggle={() => setIsEditing((v) => !v)}
				onClearSelected={() => setSelectedItems([])}
				onSave={handleSaveChanges}
				hasChanges={hasChanges}
			/>

			<div className="flex h-full overflow-y-scroll ">

				<Selector
					current={sectionTree.slug}
					collections={sectionTree.collections}
				/>

				{collections.length >= 1 ? (

					<div className="ml-36 flex-1 w-full">

						{collections.sort((a, b) => Number(b.is_default) - Number(a.is_default)).map((collection, idx) => (

							<section
								key={collection.id}
								className={cn("space-y-4", idx !== 0 && "mt-10")}
							>

								<div className="sticky top-0 z-20 bg-dashboard py-2 flex items-center space-x-8 w">

									<div className="flex items-center space-x-4">

										<h2
											className={cn(
												"text-3xl",
												roboto.className
											)}
										>
											{collection.title}
										</h2>

										{collection.is_default && (
											<Badge
												size="sm"
												variant="base"
											>
												Default
											</Badge>
										)}

									</div>

									<CollectionVisibilityBtn
										collection={collection}
									/>

								</div>

								<DndContext
									collisionDetection={closestCenter}
									onDragEnd={({ active, over }) => {

										if (!over || active.id === over.id) return;

										setCollections(prev => prev.map(c => {

											if (c.id !== collection.id) return c;

											const oldIndex = c.works.findIndex(w => String(w.id) === active.id);
											const newIndex = c.works.findIndex(w => String(w.id) === over.id);
											const newWorks = arrayMove(c.works, oldIndex, newIndex);

											return { ...c, works: newWorks };

										}));

									}}
								>
									<SortableContext
										items={collection.works.map((i) => String(i.id))}
										strategy={rectSortingStrategy}
									>

										{collection.works.length >= 1 ?

											<div className={cn(
												"grid gap-4",
												"2xl:grid-cols-8 lg:grid-cols-6 md:grid-cols-4 sm:grid-cols-2"
											)}>

												{collection.works.map((work) => (

													<SortableItem
														key={work.id}
														id={String(work.id)}
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
																	item={{ ...work, collection: { id: collection.id, title: collection.title } }}
																	isEditMode={isEditing}
																	currentPath={currentPath}
																	isSelected={selectedItems.some(
																		(i) => i.id === work.id
																	)}
																	onSelect={() =>
																		setSelectedItems((prev) => [
																			...prev,
																			{
																				id: work.id,
																				collectionId: collection.id,
																			},
																		])
																	}
																	onDeselect={() =>
																		setSelectedItems((prev) =>
																			prev.filter((i) => i.id !== work.id)
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

											</div> : (

												<div className="h-20 w-full flex items-center justify-center">
													<p className="text-muted-foreground">This collection is empty. Upload some work to get started.</p>
												</div>

											)}

									</SortableContext>

								</DndContext>

							</section>

						))}

					</div>

				) : (

					<div className="h-full w-full flex items-center justify-center">
						<p className="text-muted-foreground">Empty sections are hidden from the public site.</p>
					</div>

				)}

			</div>

		</div>

	);

};