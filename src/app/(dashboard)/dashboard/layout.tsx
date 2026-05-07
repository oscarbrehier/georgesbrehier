import React, { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import { cn } from "@/utils/utils";
import { AuthNav } from "../components/AuthNav";
import Breadcrumbs from "./Breadcrumbs";
import { getSections } from "@/utils/supabase/sections";
import { ArrowLeft } from "lucide-react";
import { PageTracker } from "./PageTracker";

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

async function BreadcrumbsWrapper() {

	const sections = await getSections();

	return (
		<Breadcrumbs sections={sections} />
	);

};

export default async function Layout({
	children
}: {
	children: React.ReactNode
}) {

	const basePath = "/dashboard";

	const navItems = [
		{ href: "/sections", label: "volumes" },
		{ href: "/upload", label: "upload" },
		{ href: "/seo", label: "seo" },
	];

	return (

		<div className="min-h-screen w-full px-8 pb-8 pt-24 bg-dashboard">

			<div className={cn(
				"w-full fixed top-0 left-0 z-50 px-8 pb-7 space-y-2 bg-dashboard",
			)}>

				<div className={cn(
					"h-10 w-full",
					"flex justify-between items-center",
					"bg-dashboard border-b border-neutral-200"
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
					<PageTracker />
					<BreadcrumbsWrapper />
				</Suspense>

			</div>

			<Suspense>
				{children}
			</Suspense>

		</div>

	);

};