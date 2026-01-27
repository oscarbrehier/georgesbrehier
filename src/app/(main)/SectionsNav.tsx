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

		<div className="col-span-3 h-full flex items-center justify-center space-x-12">

			{sections.map((section) => (

				<Link
					key={section.id}
					href={`/${section.slug}`}
					className={cn("capitalize text-[15px]", isActive(section.slug) && "underline")}
				>
					{section.title}
				</Link>

			))}

		</div>

	);

};