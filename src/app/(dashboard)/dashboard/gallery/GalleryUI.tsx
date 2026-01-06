"use client"

import { Selector } from "./Selector";
import { cn } from "@/utils/utils";
import { roboto } from "@/utils/fonts";
import { GalleryItem } from "./GalleryItem";
import { useEffect, useState } from "react";
import { Toolbar } from "./Toolbar";

export function GalleryUI({
	section,
	sections,
	collections,
	groupedGalleryItems
}: {
	section: string,
	sections: any[],
	collections: GalleryCollection[],
	groupedGalleryItems: Record<string, GalleryItemWithCollection[]>
}) {

	const [isEditing, setIsEditing] = useState(false);
	const [selectedItems, setSelectedItems] = useState<GalleryItemToDelete[]>([]);

	useEffect(() => {
		if (!isEditing) setSelectedItems([]);
	}, [isEditing]);

	return (

		<div className="h-[calc(100vh-104px)] w-full flex flex-col">

			<Toolbar
				isEditing={isEditing}
				selectedItems={selectedItems}
				onEditToggle={() => setIsEditing(prev => !prev)}
				onClearSelected={() => setSelectedItems([])}
			/>

			<div className="h-[calc(100vh-184px)] w-full flex">

				<div className="h-full w-44">
					{(sections && collections) && (
						<Selector sections={sections} current={section} collections={collections} />
					)}
				</div>

				<div className="h-full w-full overflow-y-scroll px-4">

					{collections?.map((collection, idx) => {

						const items = groupedGalleryItems[collection.slug];
						if (!items) return null;


						return (

							<section key={collection.slug} id={collection.slug} className={cn("space-y-2", idx !== 0 && "mt-8")}>

								<h2
									className={cn(
										"text-5xl text-black bg-neutral-100 py-2 sticky top-0 z-20",
										roboto.className
									)}
								>
									{collection.title}
								</h2>

								<div className="grid grid-cols-6 gap-4 z-10">

									{items.map((item) => (

										<GalleryItem
											key={item.id}
											item={item}
											isSelected={selectedItems.some(i => i.id === item.id)}
											isEditMode={isEditing}
											onSelect={() => setSelectedItems(prev => [...prev, { id: item.id, collectionId: item.collection.id }])}
											onDeselect={() => setSelectedItems(prev => prev.filter(i => i.id !== item.id))}
										/>

									))}

								</div>

							</section>

						);
					})}


				</div>

			</div>

		</div>

	);

};