"use client"

import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { useState } from "react";

const SectionForm = dynamic(() => import("./SectionForm").then(mod => mod.SectionForm));
const CollectionForm = dynamic(() => import("./CollectionForm").then(mod => mod.CollectionForm));

export interface EditData {
	id: string;
	title: string;
	is_default: boolean;
	[key: string]: any;
};

export function CreateItemDialog({
	type,
	children,
	initialData,
	onSuccess,
	open: controlledOpen,
	onOpenChange: setControlledOpen,
}: {
	type: "section" | "collection";
	initialData?: EditData;
	children?: React.ReactNode;
	onSuccess?: () => void;
	open?: boolean;
	onOpenChange?: (state: boolean) => void;
}) {

	const [internalOpen, setInternalOpen] = useState(false);

	const isControlled = controlledOpen !== undefined;
	const isOpen = isControlled ? controlledOpen : internalOpen;

	const isEditMode = !!initialData;

	function handleOpenChange(val: boolean) {

		if (isControlled) {
			setControlledOpen?.(val);
		} else {
			setInternalOpen(val);
		};

	};

	function handleSuccess() {

		onSuccess?.();

		setTimeout(() => {
			handleOpenChange(false);			
		}, 2000);

	};

	return (

		<Dialog open={isOpen} onOpenChange={handleOpenChange}>

			<DialogTrigger asChild>
				{children}
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px] bg-dashboard">

				<DialogHeader>
					<DialogTitle>
						{isEditMode
							? `Edit ${type}: ${initialData.title}`
							: `Create new ${type}`
						}
					</DialogTitle>
				</DialogHeader>

				{type === "section" && <SectionForm onSuccess={handleSuccess} initialData={initialData} />}
				{type === "collection" && <CollectionForm onSuccess={handleSuccess} initialData={initialData} />}

			</DialogContent>

		</Dialog>

	);

};