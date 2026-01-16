"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

export default function Breadcrumbs({
	sections
}: {
	sections: GallerySection[];
}) {

	const pathname = usePathname()
	const breadcrumbs = pathname.split('/')
	breadcrumbs.shift()

	return (

		<Breadcrumb>
			<BreadcrumbList>

				{breadcrumbs.map((item, index) => {

					const href = '/' +
						breadcrumbs.slice(0, index + 1).join('/');

					return (

						<Fragment key={href}>
							{(item === "sections" && sections.length !== 0) ? (

								<BreadcrumbItem>
									<DropdownMenu>
										<DropdownMenuTrigger>sections</DropdownMenuTrigger>
										<DropdownMenuContent align="start">
											<Link href={href}>
												<DropdownMenuItem>
													all
												</DropdownMenuItem>
											</Link>
											<DropdownMenuSeparator />
											{sections.map((section) => (
												<Link key={section.id} href={`${href}/${section.slug}`}>
													<DropdownMenuItem key={section.id}>
														{section.title}
													</DropdownMenuItem>
												</Link>
											))}
										</DropdownMenuContent>
									</DropdownMenu>
								</BreadcrumbItem>

							) : (

								<BreadcrumbItem>
									<BreadcrumbLink href={href}>{item}</BreadcrumbLink>
								</BreadcrumbItem>

							)}
							{index !== breadcrumbs.length - 1 && <BreadcrumbSeparator />}
						</Fragment>

					);
				})}

			</BreadcrumbList>
		</Breadcrumb>

	);

};