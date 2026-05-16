import React, { Suspense } from "react";
import "../globals.css";
import { getNavSections } from "@/utils/supabase/sections";
import { Navigation } from "@/components/Navigation";
import { cn } from "@/utils/utils";


export default async function Layout({
	children,
	nav,
}: Readonly<{
	children: React.ReactNode;
	nav?: React.ReactNode;
}>) {

	const sectionNav = await getNavSections();

	return (

		// commented lines are the version of the website that create a scrolling behaviour in safari

		// <main className="h-svh flex flex-col overflow-hidden gallery-stack:h-auto gallery-stack:block gallery-stack:overflow-visible">
		<main className="fixed inset-0 flex flex-col overflow-hidden gallery-stack:relative gallery-stack:h-auto gallery-stack:block gallery-stack:overflow-visible">

			<Navigation sectionNav={sectionNav} />

			<div
				className="flex-1 min-h-0 overflow-y-auto gallery-stack:overflow-visible gallery-stack:contents"
				style={{ WebkitOverflowScrolling: 'touch' }}
			>
				{/* <div className="flex-1 flex flex-col min-h-0 relative gallery-stack:contents"> */}
				<Suspense>
					{children}
				</Suspense>
			</div>

		</main>

	);

};
