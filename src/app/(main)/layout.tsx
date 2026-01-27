import React, { Suspense } from "react";
import "../globals.css";
import { roboto } from "@/utils/fonts";
import { cn } from "@/lib/utils";
import { getNavSections, getSections } from "@/utils/supabase/sections";
import Link from "next/link";
import { SectionsNav } from "./SectionsNav";

export default async function Layout({
	children,
	nav,
}: Readonly<{
	children: React.ReactNode;
	nav?: React.ReactNode;
}>) {

	const navItems = await getNavSections();

	return (

		<main>

			<header
				className="w-full fixed px-8 h-18 grid grid-cols-5 z-20"
			>

				<div className="col-span-1 flex items-center">
					<h1 className={`${roboto.className} font-semibold text-xl text-neutral-800 tracking-widest space-x-4`}>
						<span>Georges</span>
						<span>Bréhier</span>
					</h1>
				</div>

				<Suspense>
					<SectionsNav
						sections={navItems}
					/>
				</Suspense>

				<div className="col-span-1 flex items-center justify-between">
					<p className="text-[15px]">History</p>
					<p className="text-[15px]">About</p>
				</div>

			</header>

			<Suspense>
				{children}
			</Suspense>

		</main>

	);

};
