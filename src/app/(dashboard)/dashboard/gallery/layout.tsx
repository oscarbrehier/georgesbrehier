"use client"

import React from "react";
import Link from "next/link";
import { cn } from "@/utils/utils";
import { usePathname } from "next/navigation";

export default function Layout({ children }: { children: React.ReactNode }) {

	const pathname = usePathname();

	const basePath = "/dashboard";

	const navItems = [
		{ href: "/gallery", label: "gallery" },
		{ href: "/gallery/upload", label: "upload" }
	];

	return (
		<div className="min-h-screen w-full p-8 space-y-4 flex flex-col">

			<div className="h-auto w-full flex items-end py-4 space-x-10 text-black border-b border-black capitalize">

				{navItems.map((item) => {

					const fullHref = `${basePath}${item.href}`;
					const isActive = pathname === fullHref;

					return (
						<Link
							key={item.href}
							href={fullHref}
							className={cn(
								"cursor-pointer",
								isActive
									? "text-5xl md:text-6xl font-light text-slate-900 mb-2 tracking-tight"
									: "text-neutral-600 hover:text-black"
							)}
						>
							{item.label}
						</Link>
					);

				})}

			</div>

			{children}

		</div>
	);
}
