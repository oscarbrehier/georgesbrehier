"use client"

import { Dialog, DialogHeader, DialogTrigger, DialogContent, DialogTitle } from "@/components/ui/dialog";
import dynamic from "next/dynamic";
import { useState } from "react";

const NewSectionForm = dynamic(() => import("./NewSectionForm").then(mod => mod.NewSectionForm));
const NewCollectionForm = dynamic(() => import("./NewCollectionForm").then(mod => mod.NewCollectionForm));

export function CreateItemDialog({
	type,
	children,
	onSuccess,
	open,
	onOpenChange,
}: {
	type: "section" | "collection";
	children?: React.ReactNode;
	onSuccess?: () => void;
	open?: boolean;
	onOpenChange?: (state: boolean) => void;
}) {

	function handleSuccess() {
		onOpenChange?.(false);
		onSuccess?.();
	};

	return (

		<Dialog open={open} onOpenChange={onOpenChange}>

			<DialogTrigger asChild>
				{children}
			</DialogTrigger>

			<DialogContent className="sm:max-w-[425px]">

				<DialogHeader>
					<DialogTitle>Create new {type}</DialogTitle>
				</DialogHeader>

				{type === "section" && <NewSectionForm onSuccess={handleSuccess} />}
				{type === "collection" && <NewCollectionForm onSuccess={handleSuccess} />}

			</DialogContent>

		</Dialog>

	);

};