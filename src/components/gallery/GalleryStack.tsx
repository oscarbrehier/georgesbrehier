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

		<div className="sm:hidden flex flex-col min-h-0 pt-10 px-8">

			<div className="w-full mb-2 space-x-4 flex overflow-y-scroll">

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

			<div className="flex-1 w-full overflow-y-auto flex flex-col items-center space-y-8 bg-background hide-scrollbar">

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