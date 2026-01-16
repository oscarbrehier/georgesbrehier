import { Button, ButtonText } from "@/app/(dashboard)/components/Button";
import { cn } from "@/utils/utils";
import { Eye, EyeOff, Grip } from "lucide-react";
import Link from "next/link";
import { NavigableItem } from "./NavigatorUI";

export function NavigatorItem<T extends NavigableItem>({
	item,
	basePath,
	dragAttributes,
	dragListeners,
	onUpdate
}: {
	item: T;
	basePath: string;
	dragAttributes: any;
	dragListeners: any;
	onUpdate: (id: string, data: any) => Promise<{ error?: string | null }>;
}) {

	const borderColor = item.is_default ? "border-amber-400" : "border-blue-400";

	return (

		<div className={cn(
			"relative bg-neutral-100 rounded-xl w-full flex items-center space-x-6 p-6 group border-l-6",
			item.is_visible ? borderColor : "opacity-70 hover:opacity-100"
		)}>

			<Link href={`${basePath}/${item.slug}`} className="absolute inset-0 z-0" />

			<div className="relative z-10" {...dragAttributes} {...dragListeners}>
				<Grip className="text-neutral-400 cursor-grab active:cursor-grabbing" />
			</div>

			<div className="w-full flex justify-between items-start">

				<div>
					<p className="text-lg font-medium">{item.title}</p>
					<p className="text-neutral-500 text-sm">/{item.slug}</p>
				</div>

				<div className="flex space-x-2 relative z-10">

					<Button
						variant="base" size="sm" Icon={item.is_visible ? EyeOff : Eye}
						onClick={() => onUpdate(item.id, { is_visible: !item.is_visible })}
					>
						<ButtonText>{item.is_visible ? "Hide" : "Show"}</ButtonText>
					</Button>
					
				</div>

			</div>

		</div>

	);

};