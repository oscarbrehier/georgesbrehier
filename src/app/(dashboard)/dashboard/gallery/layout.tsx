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

			<div className="h-10 flex space-x-10 border-b-[1px] border-neutral-200">

				{navItems.map((item) => {

					const fullHref = `${basePath}${item.href}`;
					const isActive = pathname === fullHref;

					return (
						<Link
							key={item.href}
							href={fullHref}
							className={cn(
								"cursor-pointer",
								isActive ? "text-black" : "text-neutral-500"
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

};
