"use client"

import { cn } from "@/utils/utils";
import Link from "next/link";

export function Selector({
	sections,
	collections,
	current
}: {
	sections: string[],
	collections: GalleryCollection[],
	current: string
}) {

	if (!sections) return;

	return (

		<div className="h-auto w-full flex flex-col space-y-4">

			<div className="space-x-10 border-[1px]">

				{sections.map((section, idx) => (

					<Link
						key={`section-${section}-${idx}`}
						href={`/dashboard/gallery?section=${section}`}
						className={cn(
							"cursor-pointer",
							current === section ? "text-black" : "text-neutral-500 hover:text-black"
						)}>
						{section}
					</Link>

				))}

			</div>

			<div className="flex items-center space-x-10">

				<div className="bg-black h-[1px] w-32 w" />

				{collections.map((collection) => (

					<button
						className="text-black"
					>
						{collection.title}
					</button>

				))}

			</div>

		</div>

	);

};