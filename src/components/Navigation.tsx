"use client"

import { SectionsNav } from "@/app/(main)/SectionsNav";
import { cn } from "@/utils/utils";
import { Menu } from "lucide-react";
import Link from "next/link";
import { Suspense, useEffect, useState } from "react";

const UTILITY_LINKS = [
	{ title: "History", href: "/" },
	{ title: "About", href: "/" },
];

export function Navigation({
	sectionNav
}: {
	sectionNav: SectionNavItem[];
}) {

	const [isMenuOpen, setIsMenuOpen] = useState(false);

	useEffect(() => {

		if (isMenuOpen) document.body.style.overflow = "hidden";
		else document.body.style.overflow = "unset";

	}, [isMenuOpen]);

	return (

		<header
			className={cn(
				"w-full px-8 z-20 bg-background flex flex-col py-6",
				"gallery-stack:fixed gallery-stack:grid lg:grid-cols-5 grid-cols-4 lg:h-18 gallery-stack:flex-row gallery-stack:items-center gallery-stack:py-4"
			)}
		>

			<nav
				aria-label="Mobile Utility Menu"
				className={cn(
					"fixed inset-0 h-svh w-full flex flex-col py-18 bg-background z-20",
					"transition-all duration-300 ease-in-out",
					isMenuOpen
						? "opacity-100 pointer-events-auto"
						: "opacity-0 pointer-events-none"
				)}
			>

				{UTILITY_LINKS.map((link, idx) => (

					<Link
						href={link.href}
						onClick={() => setIsMenuOpen(false)}
						className={cn(
							"w-full px-8 py-4 border-b border-neutral-200/50",
							idx === 0 && "border-t"
						)}>
						<p>{link.title}</p>
					</Link>

				))}

			</nav>

			<div className="gallery-stack:col-span-1 col-span-2 w-full gallery-stack:block flex justify-between z-30">

				<Link href="/" className="flex items-center">
					<h1 className={`font-title font-semibold text-xl text-neutral-800 tracking-wide space-x-4 flex shrink-0`}>
						<span>Georges</span>
						<span>Bréhier</span>
					</h1>
				</Link>

				<button
					onClick={() => setIsMenuOpen(prev => !prev)}
					aria-expanded={isMenuOpen}
					aria-label="Toggle navigation menu"
					className="gallery-stack:hidden flex items-center space-x-2 cursor-pointer"
				>
					<span>Menu</span>
					<Menu size={18} className="mt-0.5" />
				</button>

			</div>

			<Suspense>
				<nav
					aria-label="Main Sections"
					className={cn(
						"col-span-3",
						"mt-6 sm:mt-0 lg:flex hidden flex-col sm:flex-row sm:justify-center"
					)}
				>
					<SectionsNav sections={sectionNav} />
				</nav>
			</Suspense>

			<div aria-label="Utility Links" className="lg:col-span-1 col-span-2 hidden gallery-stack:flex items-center lg:justify-between justify-end space-x-12">
				{UTILITY_LINKS.map((link) => (
					<Link href={link.href} className="text-[15px]">{link.title}</Link>
				))}
			</div>

			<Suspense>
				<nav
					aria-label="Sections Mobile"
					className={cn(
						"row-start-2 col-span-4 w-full pt-4",
						"sm:mt-0 flex lg:hidden flex-col sm:flex-row"
					)}
				>
					<SectionsNav sections={sectionNav} />
				</nav>
			</Suspense>

		</header>

	);

};