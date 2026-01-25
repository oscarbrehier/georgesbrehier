"use client"

import { cn } from "@/utils/utils";
import Link from "next/link";

export function Selector({
	collections,
	current
}: {
	collections: { title: string }[],
	current: string
}) {

	function scrollTo(collection: string) {

		if (!document) return;

		const target = document.getElementById(collection);

		if (target) {
			target.scrollIntoView({ behavior: "smooth" });
		};

	};

	return (

		<div className="h-full w-36 flex flex-col space-y-6 pr-8 fixed">

			<div className="flex items-start flex-col w-full space-y-2">

				{collections.map((collection, idx) => (

					<button
						onClick={() => scrollTo(collection.title)}
						key={`${collection.title}-${idx}`}
						className="text-black cursor-pointer text-sm w-full text-left truncate"
						title={collection.title}
					>
						{collection.title}
					</button>

				))}

			</div>

		</div>

	);

};