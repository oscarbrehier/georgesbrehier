"use client"

import { Eye, EyeOff, Grip, Pen, SquareArrowUp } from "lucide-react";
import { Button, ButtonText } from "../../components/Button";
import { CreateItemDialog } from "../../components/CreateItemDialog";
import { SectionUpdatePayload, updateSection } from "../../actions/sections";
import { toast } from "sonner";
import { MouseEvent } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function SectionItem({
	section,
	dragAttributes,
	dragListeners,
}: {
	section: GallerySection;
	dragAttributes?: any;
	dragListeners?: any;
}) {


	async function updateValue(e: MouseEvent<HTMLButtonElement>, key: keyof SectionUpdatePayload, value: any) {

		e.preventDefault();

		const { error } = await updateSection(section.id, {
			[key]: value
		});

		if (error) toast("Modification failed", { description: error });

	};

	const borderColor = section.is_default ? "border-amber-400" : "border-blue-400";

	return (

		<div
			className={cn(
				"relative h-auto bg-neutral-100 rounded-xl w-full flex items-center space-x-6 p-6 group cursor-pointer",
				"border-l-6",
				section.is_visible ? borderColor : "opacity-70 hover:opacity-100"
			)}
		>

			<Link
				href={`sections/${section.slug}`}
				className="absolute inset-0 z-0"
				aria-label={section.title}
			/>

			<div
				className="relative z-10"
				onClick={(e) => {
					e.preventDefault();
					e.stopPropagation();
				}}
				{...dragAttributes}
				{...dragListeners}
			>
				<Grip
					className="text-neutral-400 hover:text-neutral-950 cursor-grab active:cursor-grabbing"
				/>
			</div>

			<div className="w-full flex flex-col">

				<div className="w-full flex items-start justify-between">

					<div className="flex items-center space-x-10">

						<div>
							<p className="text-lg">{section.title}</p>
							<p className="text-neutral-500">/{section.slug}</p>
						</div>

						<div className="flex space-x-2">

							<div
								className="py-1 px-3 rounded-lg bg-neutral-200 text-sm	"
							>
								<p>
									{section.is_visible ? "Visible" : "Hidden"}
								</p>
							</div>

							{section.is_default && (
								<p className="py-1 px-3 rounded-lg bg-neutral-200 text-sm">Default</p>
							)}

						</div>

					</div>

					<div className="flex space-x-2">

						{!section.is_default && (

							<Button
								variant="base"
								size="sm"
								Icon={SquareArrowUp}
								onClick={(e) => updateValue(e, "is_default", true)}
							>
								<ButtonText>Make default</ButtonText>
							</Button>

						)}

						<Button
							variant="base"
							size="sm"
							Icon={section.is_visible ? EyeOff : Eye}
							onClick={(e) => updateValue(e, "is_visible", !section.is_visible)}
						>
							<ButtonText>{section.is_visible ? "Hide from site" : "Show on site"}</ButtonText>
						</Button>

						<CreateItemDialog
							type="section"
							initialData={section}
						>
							<Button variant="base" size="sm" Icon={Pen}>
								<ButtonText>Edit</ButtonText>
							</Button>
						</CreateItemDialog>

					</div>

				</div>

			</div>

		</div>

	);

};