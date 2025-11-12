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

	const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, title: string) => {
		e.preventDefault();
		window.location.href = `/${section}/${title}`;
	};

	return (

		<ul>

			{collections.map((collection) => (

				<li key={collection.id}>

					<Link
						href={`/${section}/${collection.title}`}
						onClick={(e) => handleClick(e, collection.title)}
						className={cn(
							"capitalize",
							collection.title === currentCollection ? "text-black" : "text-neutral-600 hover:text-black"
						)}
					>
						{collection.title}
					</Link>

				</li>

			))}

		</ul>

	);
	
};