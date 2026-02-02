"use client";

import { cn } from "@/utils/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SectionsNav({
	sections
}: {
	sections: SectionNavItem[]
}) {

	const pathname = usePathname();

	const isActive = (slug: string) => {
		if (pathname === "/" && slug === "") return true;
		return pathname.startsWith(`/${slug}`) && slug !== "";
	};

	return (

		<div className="flex gallery-stack:flex-row flex-col gallery-stack:items-center justify-center gallery-stack:space-x-12 gallery-stack:space-y-0 space-y-4">

			{sections.map((section) => (

				<Link
					key={section.id}
					href={`/${section.slug}`}
					className={cn(
						"capitalize gallery-stack:text-[15px] text-sm transition-colors hover:text-neutral-500",
						isActive(section.slug) ? "underline underline-offset-4 text-black" : "text-neutral-600"
					)}
				>
					{section.title}
				</Link>

			))}

		</div>

	);

};