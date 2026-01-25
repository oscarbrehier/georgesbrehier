"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

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