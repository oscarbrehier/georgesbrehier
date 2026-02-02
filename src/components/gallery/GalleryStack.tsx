import Image from "next/image";
import Link from "next/link";

export default function GalleryStack({
	items,
	collections,
	currentCollection,
}: {
	items: GalleryItem[];
	collections: CollectionNavItem[];
	currentCollection: string;
}) {

	return (

		<div className="h-full flex flex-col overflow-hidden bg-background px-8 pt-10">

			<div className="flex-none w-full mb-2 z-10">

				<div className="flex space-x-6 overflow-x-auto items-center">

					{collections.map((item) => (
						<Link
							key={item.id}
							href={item.slug}
							className={`shrink-0 text-sm ${currentCollection === item.id && "underline"}`}
						>
							{item.title}
						</Link>
					))}

				</div>

			</div>

			<div className="flex-1 w-full overflow-y-auto min-h-0 pb-8 space-y-8 overscroll-y-contain hide-scrollbar">

				{items.map((image, idx) => (

					<figure
						key={`${image.id}-${idx}`}
						className="max-w-xl w-full"
					>

						<Image
							src={image.image_url}
							alt={image.title}
							width={600}
							height={800}
							className="w-full h-auto"
							loading={idx < 3 ? "eager" : "lazy"}
						/>

						{image.title && (
							<figcaption className="text-black mt-1 sr-only">{image.title}</figcaption>
						)}

					</figure>

				))}

			</div>

		</div>

	);

};