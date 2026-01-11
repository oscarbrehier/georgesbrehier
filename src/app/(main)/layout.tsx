import React, { Suspense } from "react";
import "../globals.css";
import { roboto } from "@/utils/fonts";
import { cn } from "@/lib/utils";
import { getSections } from "@/utils/supabase/sections";
import Link from "next/link";

export default async function Layout({
	children,
	nav,
}: Readonly<{
	children: React.ReactNode;
	nav?: React.ReactNode;
}>) {

	const sections = await getSections();

	return (
		<>

			<header className={cn(
				"fixed top-0 left-0 z-60",
				"lg:h-screen lg:w-36 w-full p-8",
				"bg-background",
				"flex lg:flex-col items-center lg:justify-start justify-between"
			)}>

				<h1 className={`${roboto.className} font-semibold text-xl capitalize text-neutral-800 flex flex-col -space-y-1.5`}>
					<span>georges</span>
					<span>bréhier</span>
				</h1>

				<nav className='lg:w-full w-auto lg:mt-20' aria-label="Main navigation">
					{nav}
				</nav>

			</header>

			<div className="pl-44 pt-11.5 w-full fixed top-0 left-0 flex z-60">

				{sections.map((section) => (
					<Link
						key={section.id}
						href={`/${section.slug}`}
						className="capitalize text-[15px]"
					>
						{section.title}</Link>
				))}

			</div>

			<Suspense>
				{children}
			</Suspense>

		</>
	);

};
