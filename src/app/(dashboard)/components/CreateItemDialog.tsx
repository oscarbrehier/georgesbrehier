"use client"

import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import dynamic from "next/dynamic";

const SectionForm = dynamic(() => import("./SectionForm").then(mod => mod.SectionForm));
const NewCollectionForm = dynamic(() => import("./NewCollectionForm").then(mod => mod.NewCollectionForm));

export interface EditData {
	id: string;
	title: string;
	is_default: boolean;
	[key: string]: any;
}

export function CreateItemDialog({
	type,
	children,
	initialData,
	onSuccess,
	open,
	onOpenChange,
}: {
	type: "section" | "collection";
	initialData?: EditData;
	children?: React.ReactNode;
	onSuccess?: () => void;
	open?: boolean;
	onOpenChange?: (state: boolean) => void;
}) {

	const isEditMode = !!initialData;

	function handleSuccess() {
		onOpenChange?.(false);
		onSuccess?.();
	};

	return (

		<Dialog open={open} onOpenChange={onOpenChange}>

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
				{type === "collection" && <NewCollectionForm onSuccess={handleSuccess} initialData={initialData} />}

			</DialogContent>

		</Dialog>

	);

};