import { CloudUpload, Eye, Plus } from "lucide-react";
import { Button, ButtonText } from "./Button";
import { CreateItemDialog, EditData } from "./dialog/CreateItemDialog";
import { cn } from "@/utils/utils";
import { UI_LABELS } from "@/utils/constants";
import Link from "next/link";

export function QuickActions({
	className,
	initialData,
	sectionId,
	upload = {},
}: {
	className?: string;
	initialData?: EditData;
	sectionId?: string;
	upload?: { sectionId?: string };
}) {

	return (

		<div className={cn(
			"flex sm:flex-row flex-col sm:items-start items-end gap-2",
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
				initialData={initialData}
			>
				<Button
					className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800"
					Icon={Plus}
					size="sm"
				>
					<ButtonText>
						Create new {UI_LABELS.section.capitalized}
					</ButtonText>
				</Button>
			</CreateItemDialog>

			<CreateItemDialog
				type="collection"
				initialData={initialData}
			>
				<Button
					className="bg-neutral-200 hover:bg-neutral-300 text-neutral-800"
					Icon={Plus}
					size="sm"
				>
					<ButtonText>
						Create new {UI_LABELS.collection.capitalized}
					</ButtonText>
				</Button>
			</CreateItemDialog>

			{upload.sectionId && (

				<Link
					href={`/dashboard/upload?section=${sectionId}`}
				>
					<Button
						size="sm"
						Icon={CloudUpload}
					>
						<ButtonText>
							Upload
						</ButtonText>
					</Button>
				</Link>

			)}

		</div>

	);

};