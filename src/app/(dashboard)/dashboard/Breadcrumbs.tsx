"use client"

import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { usePathname } from "next/navigation";
import { Fragment } from "react/jsx-runtime";

export default function Breadcrumbs() {

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
							<BreadcrumbItem>
								<BreadcrumbLink href={href}>{item}</BreadcrumbLink>
							</BreadcrumbItem>
							{index !== breadcrumbs.length - 1 && <BreadcrumbSeparator/>}
						</Fragment>

					);
				})}

			</BreadcrumbList>
		</Breadcrumb>

	);

};