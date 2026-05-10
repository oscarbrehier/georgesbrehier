import { Button, ButtonText } from "@/app/(dashboard)/components/Button";
import { cn } from "@/utils/utils";
import { Eye, EyeOff, Grip, Loader2, Pen, SquareArrowUp, Trash } from "lucide-react";
import Link from "next/link";
import { NavigableItem } from "./NavigatorUI";
import { Badge } from "../../components/Badge";
import { CreateItemDialog } from "../../components/dialog/CreateItemDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UI_LABELS } from "@/utils/constants";
import { MouseEvent, useState, useTransition } from "react";
import { deleteSection } from "../../actions/sections";
import { deleteCollection } from "../../actions/collections";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function NavigatorItem<T extends NavigableItem>({
	item,
	basePath,
	dragAttributes,
	type,
	dragListeners,
	onUpdate
}: {
	item: T;
	basePath: string;
	type: "section" | "collection";
	dragAttributes: any;
	dragListeners: any;
	onUpdate: (id: string, data: any) => void;
}) {

	const status = item.status || (item.is_visible ? "visible" : "hidden");

	const getStatusUI = (status: string) => {
		switch (status) {
			case "visible":
				return {
					label: "Publicly Visible",
					classes: "border-blue-400"
				};
			case "empty":
				return {
					label: "Hidden: Needs Content",
					classes: "border-amber-400"
				};
			case "hidden":
			default:
				return {
					label: "Hidden",
					classes: "border-neutral-300"
				};
		}
	};

	const statusUI = getStatusUI(status);
	const isVisible = status === "visible";
	
	return (

		<div className={cn(
			"relative bg-neutral-100 rounded-xl w-full flex items-center space-x-6 p-6 group border-l-6",
			"outline-1 outline-neutral-200",
			status === "hidden" ? "opacity-70 hover:opacity-100 border-neutral-300" : statusUI.classes
		)}>

			<Link href={`${basePath}/${item.slug}`} className="absolute inset-0 z-0" />

			<div className="relative z-10" {...dragAttributes} {...dragListeners}>
				<Grip className="text-neutral-400 cursor-grab active:cursor-grabbing" />
			</div>

			<div className="w-full flex justify-between items-start">

				<div className="flex items-center space-x-10">

					<div>
						<p className="text-lg font-medium">{item.title}</p>
						<p className="text-neutral-500 text-sm">/{item.slug}</p>
					</div>

					<div className="flex space-x-2">

						{item.parent_hidden ? (
							<Badge variant="destructive">
								{UI_LABELS.section.capitalized} Hidden
							</Badge>
						) : (

							<Badge>
								<span className="capitalize">
									{statusUI.label}
								</span>
							</Badge>

						)}

						{item?.is_default && (
							<Badge>Default</Badge>
						)}

					</div>

				</div>

				<div className="flex space-x-2 relative z-10">

					{!item?.is_default && (

						<Button
							variant="base"
							size="sm"
							Icon={SquareArrowUp}
							onClick={(e) => onUpdate(item.id, { is_default: true })}
						>
							<ButtonText>Make default</ButtonText>
						</Button>

					)}

					<Tooltip>

						<TooltipTrigger asChild>
							<Button
								variant="base" size="sm" Icon={isVisible ? EyeOff : Eye}
								onClick={() => onUpdate(item.id, { is_visible: !item.is_visible })}
								disabled={item.parent_hidden}
							>
								<ButtonText>{isVisible ? "Hide" : "Show"}</ButtonText>
							</Button>
						</TooltipTrigger>

						{item.parent_hidden && (
							<TooltipContent>
								<p className="w-full max-w-96 text-center">
									You can't show this {UI_LABELS.collection.singular} because its {UI_LABELS.section.singular} is hidden. Please update the {UI_LABELS.section.singular} settings first.
								</p>
							</TooltipContent>
						)}
					</Tooltip>

					<CreateItemDialog
						type={type}
						initialData={item}
					>
						<Button variant="base" size="sm" Icon={Pen}>
							<ButtonText>Edit</ButtonText>
						</Button>
					</CreateItemDialog>

					<DeleteButton
						type={type}
						item={item as any}
					/>

				</div>

			</div>

		</div>

	);

};

type DeleteButtonProps =
	| { type: "section"; item: { title: string; id: string; } }
	| { type: "collection"; item: { title: string; id: string; section_id: string } };

function DeleteButton({ type, item }: DeleteButtonProps) {

	const router = useRouter();
	const [isPending, startTransition] = useTransition();

	async function handleDelete(e: MouseEvent<HTMLButtonElement>) {

		e.preventDefault();
		e.stopPropagation();

		if (isPending) return;

		const sectionWarning = `Are you sure? Deleting "${item.title}" will permanently remove ALL associated ${UI_LABELS.collection.plural}. Your actual work will remain but will stay unassigned.`;
		const collectionWarning = `Are you sure you want to delete the "${item.title}" ${UI_LABELS.collection.singular}? Artwork inside will become unassigned.`;

		const message = type === "section" ? sectionWarning : collectionWarning;
		if (!window.confirm(message)) return;

		const { error } = type === "section"
			? await deleteSection(item.id)
			: await deleteCollection(item.id, (item as any).section_id);

		if (error) {
			toast("Deletion failed", { description: error });
		} else {

			startTransition(() => {
				router.refresh();
			});

			toast.success("Deleted!");

		};

	};

	return (

		<Button
			variant="destructive"
			size="icon"
			Icon={isPending ? Loader2 : Trash}
			loading={isPending}
			onClick={handleDelete}
		/>

	);

};