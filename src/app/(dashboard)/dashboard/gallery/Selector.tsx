"use client"

import { cn } from "@/utils/utils";
import Link from "next/link";
import { Button, ButtonText } from "../../components/Button";
import { Eye } from "lucide-react";

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

	function scrollTo(collection: string) {

		if (!document) return;

		const target = document.getElementById(collection);

		if (target) {
			target.scrollIntoView({ behavior: "smooth" });
		};

	};

	return (

		<div className="h-full w-44 flex flex-col space-y-6 pr-8">

			<div className="space-y-2 flex flex-col">

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

			<div className="bg-neutral-300 h-[1px] w-full" />

			<div className="flex items-start flex-col w-full space-y-2">

				{collections.map((collection, idx) => (

					<button
						onClick={() => scrollTo(collection.title)}
						key={`${collection.title}-${idx}`}
						className="text-black cursor-pointer"
					>
						{collection.title}
					</button>

				))}

			</div>

		</div>

	);

};