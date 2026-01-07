"use client"

import React from "react";
import Link from "next/link";
import { cn } from "@/utils/utils";
import { usePathname } from "next/navigation";
import { AuthNav } from "./AuthNav";

export default function Layout({ children }: { children: React.ReactNode }) {

	const pathname = usePathname();

	const basePath = "/dashboard";

	const navItems = [
		{ href: "/gallery", label: "gallery" },
		{ href: "/gallery/upload", label: "upload" },
		{ href: "/gallery/seo", label: "seo" },
	];

	return (

		<div className="min-h-screen w-full px-8 pb-8 pt-18">

			<div className="h-10 flex justify-between items-center px-8 border-b-[1px] border-neutral-200 fixed top-0 left-0 w-full bg-neutral-100 z-[50]">

				<div className="flex space-x-10">

					{navItems.map((item) => {

						const fullHref = `${basePath}${item.href}`;
						const isActive = pathname === fullHref;

						return (
							<Link
								key={item.href}
								href={fullHref}
								className={cn(
									"cursor-pointer",
									isActive ? "text-black" : "text-neutral-500 hover:text-black"
								)}
							>
								{item.label}
							</Link>
						);

					})}

				</div>

				<div>

					<AuthNav />

				</div>

			</div>

			{children}

		</div>

	);

};
