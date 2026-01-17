"use client"
import { MouseEvent, useEffect, useState } from "react";
import { closestCenter, DndContext } from "@dnd-kit/core";
import { arrayMove, rectSortingStrategy, SortableContext } from "@dnd-kit/sortable";
import { SortableItem } from "../gallery/GalleryUI";
import { NavigatorItem } from "./NavigatorItem";
import { Button, ButtonText } from "@/app/(dashboard)/components/Button";
import { CheckCheck } from "lucide-react";
import { toast } from "sonner";
import { QuickActions } from "../../components/QuickActions";
import { useRouter } from "next/navigation";

export interface NavigableItem {
	id: string;
	section_id?: string;
	slug: string;
	title: string;
	position?: number;
	is_visible: boolean;
	is_default: boolean;
};

interface NavigatorProps<T extends NavigableItem> {
	items: T[];
	title: string;
	basePath: string;
	type: "section" | "collection";
	onSave: (changes: { id: string; position: number, section_id?: string }[]) => Promise<{ error?: string | null }>;
	onUpdateField: (id: string, data: Partial<T>) => Promise<{ error?: string | null }>;
};

export function NavigatorUI<T extends NavigableItem>({
	items,
	title,
	basePath,
	type,
	onSave,
	onUpdateField
}: NavigatorProps<T>) {

	const router = useRouter();

	const [orderedItems, setOrderedItems] = useState(items);
	const [isMounted, setIsMounted] = useState(false);

	const hasChanges = JSON.stringify(items.map(i => i.id)) !== JSON.stringify(orderedItems.map(i => i.id));

	useEffect(() => { setIsMounted(true); }, []);
	useEffect(() => { setOrderedItems(items); }, [items]);

	if (!isMounted) return null;

	async function handleSave(e: MouseEvent<HTMLButtonElement>) {

		e.preventDefault();

		const changes = orderedItems.map((item, index) => ({ 
			id: item.id,
			position: index + 1,
			...(item?.section_id && { sectionId: item.section_id })
		}));

		const { error } = await onSave(changes);

		if (error) toast.error("Update failed", { description: error });
		else toast.success("Positions updated");

		router.refresh();

	};

	return (

		<div className="h-full flex flex-col px-8 pb-8">

			<div className="mb-10 flex items-center justify-between">

				<h1 className="text-4xl">{title}</h1>

				{hasChanges && (
					<Button className="bg-amber-600 text-neutral-50" onClick={handleSave} Icon={CheckCheck}>
						<ButtonText>Save positions</ButtonText>
					</Button>
				)}

			</div>

			<QuickActions className="mb-4" />

			<DndContext collisionDetection={closestCenter} onDragEnd={({ active, over }) => {

				if (!over || active.id === over.id) return;

				setOrderedItems((prev) => {

					const oldIndex = prev.findIndex((i) => i.id === active.id);
					const newIndex = prev.findIndex((i) => i.id === over.id);

					return arrayMove(prev, oldIndex, newIndex);

				});

			}}>

				<SortableContext items={orderedItems.map(i => i.id)} strategy={rectSortingStrategy}>

					<div className="flex-1 w-full overflow-y-scroll grid 2xl:grid-cols-1 gap-4 auto-rows-max p-0.5 w">

						{orderedItems.map((item) => (

							<SortableItem key={item.id} id={item.id} disabled={false}>

								{(sortable) => (

									<div ref={sortable.setNodeRef} style={sortable.style}>
										<NavigatorItem
											item={item}
											type={type}
											basePath={basePath}
											dragAttributes={sortable.attributes}
											dragListeners={sortable.listeners}
											onUpdate={onUpdateField}
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