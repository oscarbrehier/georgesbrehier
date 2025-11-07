"use client"

import { cn } from "@/utils/utils";
import Link from "next/link";
import { useRouter } from "next/navigation";

export function SectionSelector({
	sections,
	current
}: {
	sections: string[],
	current: string
}) {

	const router = useRouter();

	if (!sections) return;

	return (

		<div className="space-x-10 capitalize">

			{sections.map((section) => (

				<Link
					key={`section-${section}`}
					href={`/dashboard/gallery?section=${section}`}
					className={cn(
						"cursor-pointer capitalize",
						current === section ? "text-5xl md:text-6xl font-light text-slate-900 mb-2 tracking-tight" : "text-neutral-600 hover:black"
					)}>
					{section}
				</Link>

			))}

		</div>

	);

};