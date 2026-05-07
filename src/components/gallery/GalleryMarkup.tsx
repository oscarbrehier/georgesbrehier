import { getActiveCollections } from "@/utils/supabase/collections";
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

	return (

		<div id="gallery-track" className="relative w-full sm:block hidden">

			<div className="sticky top-0 h-screen flex flex-col justify-center md:pl-36 pl-8 overflow-hidden">

				<div className="w-full h-8 flex space-x-8 mb-4">

					{collections.map((c) => (
						<Link key={c.id} href={`${c.slug}`} className={cn("cursor-pointer", c.id != currentCollection && "text-neutral-500 hover:text-black transition-all")}>
							{c.title}
						</Link>
					))}

				</div>

				<div
					id="gallery-wrapper"
					className="flex items-center pr-24 gap-10 will-change-transform"
				>

					{items.map((item, idx) => (

						<figure
							key={idx}
							className="shrink-0 panel 2xl:h-[50vh] xl:h-[55vh] h-[60vh] relative flex flex-col items-center justify-center w-auto"
						>

							<div
								data-itemid={item.id}
								className="relative h-[80%] w-auto transition-[width,height] ease-in-out duration-300"
								style={{ aspectRatio: `${item.image_width} / ${item.image_height}` }}
							>
								<Image
									src={item.image_url}
									alt={item.title}
									fill
									sizes="(max-height: 60vh) 50vw, 100vw"
									className="gallery-image cursor-pointer object-contain h-full w-auto"
									loading={idx < 3 ? "eager" : "lazy"}
								/>
							</div>

							<div className="w-full mt-2">
								<p className="text-neutral-600">{item.title}</p>
								<p className="text-neutral-600 text-xs">{item.image_height}cm x {item.image_width}cm</p>
							</div>

						</figure>

					))}
				</div>

			</div>

		</div>

	);

};