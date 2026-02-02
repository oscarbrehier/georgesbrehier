import React, { Suspense } from "react";
import "../globals.css";
import { roboto } from "@/utils/fonts";
import { cn } from "@/lib/utils";
import { getNavSections, getSections } from "@/utils/supabase/sections";
import Link from "next/link";
import { SectionsNav } from "./SectionsNav";
import { Navigation } from "@/components/Navigation";

export default async function Layout({
	children,
	nav,
}: Readonly<{
	children: React.ReactNode;
	nav?: React.ReactNode;
}>) {

	const sectionNav = await getNavSections();

	return (

		<main className="h-svh flex flex-col overflow-hidden gallery-stack:h-auto gallery-stack:block gallery-stack:overflow-visible">

			<Navigation sectionNav={sectionNav} />

			<div className="flex-1 flex flex-col min-h-0 relative gallery-stack:contents">
				<Suspense>
					{children}
				</Suspense>
			</div>

		</main>

	);

};
