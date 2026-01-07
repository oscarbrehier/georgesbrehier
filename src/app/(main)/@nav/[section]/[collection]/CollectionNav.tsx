'use client';

import Link from "next/link";
import { cn } from "@/utils/utils";

export function CollectionNav({
	collections,
	currentCollection,
	section
}: {
	collections: GalleryCollection[],
	currentCollection: string,
	section: string
}) {

	return (

		<ul className="space-y-1">

			{collections.map((collection) => (

				<li key={collection.id}>

					<Link
						href={`/${section}/${collection.slug}`}
						className={cn(
							"capitalize",
							collection.slug === currentCollection ? "text-black underline" : "text-neutral-600 hover:text-black"
						)}
					>
						{collection.title}
					</Link>

				</li>

			))}

		</ul>

	);
	
};