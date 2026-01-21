import { Button, ButtonText } from "@/app/(dashboard)/components/Button";
import { cn } from "@/utils/utils";
import { Eye, EyeOff, Grip, Pen, SquareArrowUp } from "lucide-react";
import Link from "next/link";
import { NavigableItem } from "./NavigatorUI";
import { Badge } from "../../components/Badge";
import { CreateItemDialog } from "../../components/CreateItemDialog";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { UI_LABELS } from "@/utils/constants";

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


	const isVisible = !item.parent_hidden && item.is_visible;

	const borderColor = item.is_default ? "border-amber-400" : "border-blue-400";

	return (

		<div className={cn(
			"relative bg-neutral-100 rounded-xl w-full flex items-center space-x-6 p-6 group border-l-6",
			"outline-1 outline-neutral-200",
			isVisible ? borderColor : "opacity-70 hover:opacity-100"
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

					<div className="flex space-x-2 ">

						<Badge>
							{isVisible ? "Visible" : "Hidden"}
						</Badge>

						{item.parent_hidden && (
                            <Badge variant="destructive">
                                {UI_LABELS.section.capitalized} Hidden
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

				</div>

			</div>

		</div>

	);

};