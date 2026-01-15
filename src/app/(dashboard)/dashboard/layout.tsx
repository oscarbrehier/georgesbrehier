import React, { Suspense } from "react";
import { Metadata } from "next";


import Link from "next/link";
import { cn } from "@/utils/utils";
import { AuthNav } from "./gallery/AuthNav";

export const metadata: Metadata = {
	title: "Dashboard",
	robots: {
		index: false,
		follow: false,
		nocache: true,
		googleBot: {
			index: false,
			follow: false
		}
	}
};

export default function Layout({
	children
}: {
	children: React.ReactNode
}) {

	const basePath = "/dashboard";

	const navItems = [
		{ href: "/gallery", label: "gallery" },
		{ href: "/gallery/upload", label: "upload" },
		{ href: "/gallery/seo", label: "seo" },
	];

	return (

		<div className="h-screen w-full px-8 pb-8 pt-18 bg-neutral-50">

			<div className={cn(
				"fixed top-0 left-0 z-50",
				"h-10 px-8 w-full",
				"flex justify-between items-center",
				"bg-neutral-50 border-b border-neutral-200"
			)}>

				<div className="flex space-x-10">

					{navItems.map((item) => {

						const fullHref = `${basePath}${item.href}`;
						const isActive = true;

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

			<Suspense>
				{children}
			</Suspense>

		</div>

	);

};