import { cn } from "@/utils/utils";
import Image from "next/image";
import Link from "next/link";

export function GalleryMarkup({
	items,
	collections,
	currentCollection,
}: {
	items: GalleryItem[];
	collections: CollectionNavItem[];
	currentCollection: string;
}) {
	const collectionData = collections.find(
		(item) => item.id === currentCollection,
	);

	return (
		<div id="gallery-track" className="relative w-full sm:block hidden">
			<div className="sticky top-0 h-screen flex flex-col justify-center md:pl-36 pl-8 overflow-hidden">
				<div className="w-full h-8 flex space-x-8 mb-4">
					{collections.map((c) => (
						<Link
							key={c.id}
							href={`${c.slug}`}
							className={cn(
								"cursor-pointer",
								c.id != currentCollection &&
									"text-neutral-500 hover:text-black transition-all",
							)}
						>
							<p className="text-xl">{c.title}</p>
						</Link>
					))}
				</div>

				<div
					id="gallery-wrapper"
					className="flex items-center pr-24 gap-10 will-change-transform"
				>
					{collectionData?.description && (
						<div className="shrink-0 panel 2xl:h-[50vh] xl:h-[55vh] h-[60vh] relative w-auto flex flex-col mt-4 mr-10">
							<div className="h-[80%] aspect-square -mt-2.5">
								<p className="text-lg tracking-wide font-ortica font-extralight">{collectionData.description}</p>
							</div>
						</div>
					)}

					{items.map((item, idx) => (
						<figure
							key={idx}
							className="shrink-0 panel 2xl:h-[50vh] xl:h-[55vh] h-[60vh] relative flex flex-col items-center w-auto mt-4"
						>
							<div
								data-itemid={item.id}
								className="relative h-[80%] w-auto flex flex-col transition-[width,height] ease-in-out duration-300"
								style={{
									aspectRatio: `${item.image_width} / ${item.image_height}`,
								}}
							>
								<div className="relative flex-1 w-full">
									<Image
										src={item.image_url}
										alt={item.title}
										fill
										sizes="(max-height: 60vh) 50vw, 100vw"
										className="gallery-image cursor-pointer object-contain h-full w-auto"
										loading={idx < 3 ? "eager" : "lazy"}
									/>
								</div>
								<div className="w-full mt-2 absolute top-full left-0">
									<p className="text-neutral-600">{item.title}</p>
									<div className="space-y-0.5 mt-0.5">
										<p className="text-neutral-600 text-xs">
											{item.description}
										</p>
										{collectionData?.show_dimensions && (
											<p className="text-neutral-600 text-xs">
												{item.height}cm x {item.width}cm
											</p>
										)}
									</div>
								</div>
							</div>
						</figure>
					))}
				</div>
			</div>
		</div>
	);
}
