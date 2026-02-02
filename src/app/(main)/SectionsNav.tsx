"use client"

import { cn } from "@/utils/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function SectionsNav({
	sections
}: {
	sections: SectionNavItem[];
}) {

	const pathname = usePathname();

	function isActive(slug: string) {
		const seg = pathname.split("/");
		return seg[1] === slug;
	};

	return (

		<div className="col-span-3 h-full flex sm:flex-row flex-col sm:items-center justify-center sm:space-x-12 space-x-0 sm:space-y-0 space-y-2">

			{sections.map((section) => (

				<Link
					key={section.id}
					href={`/${section.slug}`}
					className={cn("capitalize sm:text-[15px] text-sm", isActive(section.slug) && "underline")}
				>
					{section.title}
				</Link>

			))}

		</div>

	);

};