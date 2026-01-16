import { Eye, Plus } from "lucide-react";
import { Button, ButtonText } from "./Button";
import { CreateItemDialog } from "./CreateItemDialog";
import { cn } from "@/utils/utils";

export function QuickActions({
	className
}: {
	className?: string;
}) {

	return (

		<div className={cn(
			"flex sm:flex-row flex-col sm:items-start items-end 2lg:gap-x-4 gap-2",
			className
		)}>

			<a href="/">
				<Button
					variant="base"
					size="sm"
					Icon={Eye}
				>
					<ButtonText>View Website</ButtonText>
				</Button>
			</a>

			<CreateItemDialog
				type="section"
			>
				<Button
					className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800"
					Icon={Plus}
					size="sm"
				>
					<ButtonText>
						Create new Section
					</ButtonText>
				</Button>
			</CreateItemDialog>

			<CreateItemDialog
				type="collection"
			>
				<Button
					className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800"
					Icon={Plus}
					size="sm"
				>
					<ButtonText>
						Create new Collection
					</ButtonText>
				</Button>
			</CreateItemDialog>

		</div>

	);

};